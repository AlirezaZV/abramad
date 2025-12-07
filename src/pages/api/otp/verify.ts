import type { NextApiRequest, NextApiResponse } from "next";
import { getMongoCollection } from "../../../lib/mongodb";

interface OtpDocument {
  phone: string;
  code: string;
  createdAt: Date;
}

interface SuccessResponse {
  success: true;
}

interface ErrorResponse {
  success: false;
  error: string;
}

type ApiResponse = SuccessResponse | ErrorResponse;

const OTP_COLLECTION = process.env.MONGODB_OTP_COLLECTION ?? "otp";
const OTP_TTL_MS = 60_000;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== "POST") {
    return res
      .setHeader("Allow", "POST")
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  try {
    const { phone, code } = req.body as { phone?: string; code?: string };

    if (!phone || !code) {
      return res.status(400).json({
        success: false,
        error: "Phone number and OTP code are required",
      });
    }

    const collection = await getMongoCollection<OtpDocument>(OTP_COLLECTION);
    const record = await collection.findOne({ phone });

    if (!record) {
      return res
        .status(400)
        .json({ success: false, error: "کد تایید نامعتبر است" });
    }

    const age = Date.now() - new Date(record.createdAt).getTime();

    if (age > OTP_TTL_MS) {
      await collection.deleteOne({ phone });
      return res
        .status(400)
        .json({ success: false, error: "کد تایید منقضی شده است" });
    }

    if (record.code !== code) {
      return res
        .status(400)
        .json({ success: false, error: "کد تایید اشتباه است" });
    }

    await collection.deleteOne({ phone });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Failed to verify OTP", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to verify OTP" });
  }
}

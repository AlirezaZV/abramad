import type { NextApiRequest, NextApiResponse } from "next";
import { getMongoCollection } from "../../../lib/mongodb";

interface OtpDocument {
  phone: string;
  code: string;
  createdAt: Date;
}

interface SuccessResponse {
  success: true;
  expiresInMs: number;
  message: string;
  otpPreview?: string;
}

interface ErrorResponse {
  success: false;
  error: string;
}

type ApiResponse = SuccessResponse | ErrorResponse;

const OTP_COLLECTION = process.env.MONGODB_OTP_COLLECTION ?? "otp";
const OTP_TTL_MS = 60_000;

const generateOtp = () => Math.floor(1000 + Math.random() * 9000).toString();

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
    const { phone } = req.body as { phone?: string };

    if (!phone) {
      return res
        .status(400)
        .json({ success: false, error: "Phone number is required" });
    }

    const now = new Date();
    const collection = await getMongoCollection<OtpDocument>(OTP_COLLECTION);
    const existing = await collection.findOne({ phone });

    const existingAge = existing
      ? now.getTime() - new Date(existing.createdAt).getTime()
      : Number.POSITIVE_INFINITY;
    const isExistingValid = existingAge < OTP_TTL_MS;

    let otpCode = existing?.code ?? generateOtp();
    let message = "کد تایید ارسال شد";

    if (isExistingValid && existing) {
      message = "کد قبلی هنوز معتبر است";
    } else {
      otpCode = generateOtp();
      await collection.updateOne(
        { phone },
        { $set: { phone, code: otpCode, createdAt: now } },
        { upsert: true }
      );
    }

    const expiresInMs = isExistingValid
      ? Math.max(OTP_TTL_MS - existingAge, 0)
      : OTP_TTL_MS;

    return res.status(200).json({
      success: true,
      expiresInMs,
      message,
      otpPreview: process.env.NODE_ENV !== "production" ? otpCode : undefined,
    });
  } catch (error) {
    console.error("Failed to create OTP", error);
    return res
      .status(500)
      .json({ success: false, error: "Failed to generate OTP" });
  }
}

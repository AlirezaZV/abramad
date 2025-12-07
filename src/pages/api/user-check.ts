import type { NextApiRequest, NextApiResponse } from "next";
import { getMongoCollection } from "../../lib/mongodb";
import type { UserData } from "../../types/user";

const COLLECTION_NAME = process.env.MONGODB_COLLECTION ?? "hamkaranSystem";

interface UserDocument extends Omit<UserData, "date"> {
  date: Date;
  createdAt: Date;
}

interface SuccessResponse {
  exists: boolean;
  field?: "phone" | "email" | "both";
  message?: string;
}

interface ErrorResponse {
  error: string;
}

type ApiResponse = SuccessResponse | ErrorResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== "POST") {
    return res
      .setHeader("Allow", "POST")
      .status(405)
      .json({ error: "Method not allowed" });
  }

  try {
    const { phone, email } = req.body as Partial<UserData>;

    if (!phone && !email) {
      return res
        .status(400)
        .json({ error: "phone or email is required to perform the lookup" });
    }

    const query: { $or: Array<Record<string, string>> } = { $or: [] };

    if (phone) {
      query.$or.push({ phone });
    }

    if (email) {
      query.$or.push({ email });
    }

    const collection = await getMongoCollection<UserDocument>(COLLECTION_NAME);
    const existingUser = await collection.findOne(query, {
      projection: { phone: 1, email: 1 },
    });

    if (!existingUser) {
      return res.status(200).json({ exists: false });
    }

    let field: SuccessResponse["field"] = undefined;

    if (phone && email) {
      if (existingUser.phone === phone && existingUser.email === email) {
        field = "both";
      } else if (existingUser.phone === phone) {
        field = "phone";
      } else if (existingUser.email === email) {
        field = "email";
      }
    } else if (phone && existingUser.phone === phone) {
      field = "phone";
    } else if (email && existingUser.email === email) {
      field = "email";
    }

    return res.status(200).json({
      exists: true,
      field,
      message: "شما با این ایمیل یا شماره موبایل قبلا در مسابقه شرکت کرده‌اید!",
    });
  } catch (error) {
    console.error("Failed to verify user uniqueness", error);
    return res.status(500).json({ error: "Failed to check existing user" });
  }
}

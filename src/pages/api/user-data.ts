import type { NextApiRequest, NextApiResponse } from "next";
import { getMongoCollection } from "../../lib/mongodb";
import type { UserData } from "../../types/user";

const COLLECTION_NAME = process.env.MONGODB_COLLECTION ?? "hamkaranSystem";

type ApiResponse = { ok: true } | { error: string };

type UserDocument = Omit<UserData, "date"> & {
  date: Date;
  createdAt: Date;
};

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
    const { firstName, lastName, phone, email, date } =
      req.body as Partial<UserData>;

    if (!firstName || !lastName || !phone) {
      return res
        .status(400)
        .json({ error: "firstName, lastName, and phone are required" });
    }

    const parsedDate = date ? new Date(date) : new Date();

    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: "Invalid date value" });
    }

    const collection = await getMongoCollection<UserDocument>(COLLECTION_NAME);

    const document: UserDocument = {
      firstName,
      lastName,
      phone,
      email: email ?? "",
      date: parsedDate,
      createdAt: new Date(),
    };

    await collection.insertOne(document);

    return res.status(201).json({ ok: true });
  } catch (error) {
    console.error("Failed to persist user data", error);
    return res.status(500).json({ error: "Failed to save user data" });
  }
}

import axios from "axios";

interface MagfaPayload {
  phone: string;
  code: string;
}

const MAGFA_API_URL =
  process.env.MAGFA_API_URL ?? "https://messaging.magfa.com/api/messages";

type MagfaConfig = {
  username: string;
  password: string;
  domain: string;
  sendingNumber?: string;
};

const resolveConfig = (): MagfaConfig => {
  const username = process.env.MAGFA_USERNAME || "abramad/Marketing";
  const password = process.env.MAGFA_PASSWORD || "ma@NA220";
  const domain = process.env.MAGFA_DOMAIN || "abramad";
  const sendingNumber = process.env.MAGFA_SENDER_NUMBER || "";

  if (!username || !password || !domain) {
    throw new Error("Magfa SMS credentials are missing");
  }

  return { username, password, domain, sendingNumber };
};

export const sendMagfaOtpSms = async ({ phone, code }: MagfaPayload) => {
  const config = resolveConfig();
  const message = `کد تایید شما: ${code}`;

  await axios.post(
    MAGFA_API_URL,
    {
      sendingNumber: config.sendingNumber ?? "",
      messages: [message],
      recipients: [phone],
    },
    {
      auth: {
        username: `${config.domain}/${config.username}`,
        password: config.password,
      },
    }
  );
};

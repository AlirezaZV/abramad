import axios from "axios";

interface MagfaPayload {
  phone: string;
  code: string;
}

const MAGFA_API_URL =
  process.env.MAGFA_API_URL ?? "https://sms.magfa.com/api/http/sms/v2/send";

type MagfaConfig = {
  username: string;
  password: string;
  domain: string;
  sender: string; // your approved line like 3000xxxx
};

const resolveConfig = (): MagfaConfig => {
  const username = process.env.MAGFA_USERNAME ?? "Marketing";
  const password = process.env.MAGFA_PASSWORD ?? "OjYRosDYHLyXNPSZ";
  const domain = process.env.MAGFA_DOMAIN ?? "abramad";
  const sender = process.env.MAGFA_SENDER ?? "30007601";

  if (!username || !password || !domain) {
    throw new Error("Magfa SMS credentials are missing");
  }

  return { username, password, domain, sender };
};

export const sendMagfaOtpSms = async ({ phone, code }: MagfaPayload) => {
  const config = resolveConfig();
  const message = `کد ورود شما: ${code}\nبرای شرکت در مسابقه «نجات شرکت در سه حرکت!»\ngame.abramad.com | ابرآمد`;

  // According to Magfa docs
  const payload = {
    senders: [config.sender],
    recipients: [phone],
    messages: [message],
    encodings: [2], // UCS2 for Persian
  };

  try {
    const response = await axios.post(MAGFA_API_URL, payload, {
      proxy: false,
      auth: {
        username: `${config.username}/${config.domain}`,
        password: config.password,
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    console.error("===============Magfa SMS:==================", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "--------------------Magfa SMS Error:---------------",
      error.response?.data || error.message
    );
    throw error;
  }
};

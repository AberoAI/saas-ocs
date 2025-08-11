import axios from "axios";

const WA_BASE = "https://graph.facebook.com/v20.0";

export async function sendWhatsAppText(params: { to: string; text: string }) {
  const token = process.env.WHATSAPP_TOKEN!;
  const phoneNumberId = process.env.WA_PHONE_NUMBER_ID!;
  const url = `${WA_BASE}/${phoneNumberId}/messages`;

  const payload = {
    messaging_product: "whatsapp",
    to: params.to,
    type: "text",
    text: { body: params.text },
  };

  const res = await axios.post(url, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    timeout: 12000,
  });

  return res.data;
}

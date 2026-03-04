export type MessageRequest = {
  message: string;
};

export type MessageResponse = {
  message: string;
};

export async function sendMessage(
  data: MessageRequest
): Promise<MessageResponse> {
  const apiUrl = import.meta.env?.VITE_API_BASE_URL || "http://api:8000";
  console.log(apiUrl);
  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}
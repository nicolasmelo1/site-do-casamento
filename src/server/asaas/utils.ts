export function callAsaasApi(url: string, method: "POST" | "GET", body?: any) {
  return fetch(process.env.ASAAS_API_URL + url, {
    headers: {
      "Content-Type": "application/json",
      access_token: process.env.ASAAS_API_KEY as string,
    },
    body: JSON.stringify(body),
  });
}

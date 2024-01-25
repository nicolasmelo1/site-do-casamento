export function callAsaasApi(url: string, method: "POST" | "GET", body?: any) {
  const fetchInit: Parameters<typeof fetch>[1] = {
    headers: {
      "Content-Type": "application/json",
      access_token: process.env.ASAAS_API_KEY as string,
    },
    method,
  };

  if (["POST"].includes(method)) fetchInit.body = JSON.stringify(body);

  return fetch(process.env.ASAAS_API_URL + url, fetchInit);
}

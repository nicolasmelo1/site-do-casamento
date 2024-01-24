import { callAsaasApi } from "./utils";

export async function filterCustomerForResponse(
  response: Response,
  cpfCnpjOrName: "cpfCnpj" | "name",
  cpfCnpjOrNameValue: string
) {
  const customers = await response.json();
  const customer = customers.data.filter(
    (customer: any) => customer[cpfCnpjOrName] === cpfCnpjOrNameValue
  )[0];
  if (customer) return [true, customer?.id];
  return [false, undefined];
}

async function tryToFindCustomer(name: string, cpfCnpj: string) {
  const cpfCnpjSearchParams = new URLSearchParams([["cpfCnpj", cpfCnpj]]);
  const nameSearchParams = new URLSearchParams([["name", name]]);

  const responseForCPfCnpj = await callAsaasApi(
    `/v3/customers?${cpfCnpjSearchParams.toString()}`,
    "GET"
  );
  const [isValidFromCpfCnpj, customerIdFromCpfCnpj] =
    await filterCustomerForResponse(responseForCPfCnpj, "cpfCnpj", cpfCnpj);
  if (isValidFromCpfCnpj) return customerIdFromCpfCnpj;

  const responseForName = await callAsaasApi(
    `/v3/customers?${nameSearchParams.toString()}`,
    "GET",
    {
      name,
      cpfCnpj,
    }
  );
  const [isValidFromName, customerIdFromName] = await filterCustomerForResponse(
    responseForName,
    "name",
    name
  );
  if (isValidFromName) return customerIdFromName;

  return undefined;
}

export async function createCustomer(name: string, cpfCnpj: string) {
  const response = await callAsaasApi("/v3/customers", "POST", {
    name,
    cpfCnpj,
  });
  const customer = await response.json();
  return customer.data.id;
}

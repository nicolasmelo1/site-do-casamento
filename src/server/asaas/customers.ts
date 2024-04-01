import { callAsaasApi } from "./utils";

async function filterCustomerForResponse(
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

/**
 * Tries to find a customer by cpfCnpj or name. We use the listing because that's the only way we can search for he data, but it should be a single result.
 *
 * @param name The customer name to search for if by cpf/cnpj we don't find anything.
 * @param cpfCnpj The customer cpfCnpj to search for.
 *
 * @returns The customer id if found, undefined otherwise.
 */
async function tryToFindCustomer(name: string, cpfCnpj: string) {
  const cpfCnpjSearchParams = new URLSearchParams([["cpfCnpj", cpfCnpj]]);
  const nameSearchParams = new URLSearchParams([["name", name]]);
  const responseForCPfCnpj = await callAsaasApi(
    `/v3/customers?${cpfCnpjSearchParams.toString()}`,
    "GET"
  );
  console.log("responseForCPfCnpj");

  const [isValidFromCpfCnpj, customerIdFromCpfCnpj] =
    await filterCustomerForResponse(responseForCPfCnpj, "cpfCnpj", cpfCnpj);
  if (isValidFromCpfCnpj) return customerIdFromCpfCnpj;

  console.log("aquiiii");
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

async function createCustomer(name: string, cpfCnpj: string) {
  const response = await callAsaasApi("/v3/customers", "POST", {
    name,
    cpfCnpj,
  });
  const customer = await response.json();
  return customer.id;
}

export default async function customerFlow(name: string, cpfCnpj: string) {
  const customerId = await tryToFindCustomer(name, cpfCnpj);

  if (customerId) return customerId;
  return await createCustomer(name, cpfCnpj);
}

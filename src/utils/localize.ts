export function displayValueInCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function displayDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR").format(date);
}

export function formatterOfPhone(value: string) {
  let formattedValue = "";
  let valueWithoutNonDigits = value.replace(/\D/g, "");

  const maxLength =
    valueWithoutNonDigits.length > 11 ? 11 : valueWithoutNonDigits.length;
  for (let i = 0; i < valueWithoutNonDigits.length; i++) {
    console.log(i, formattedValue);
    if (i === 0) formattedValue += `(${valueWithoutNonDigits[i]}`;
    else if (i === 1 && valueWithoutNonDigits[i + 1] !== undefined)
      formattedValue += `${valueWithoutNonDigits[i]}) `;
    else if (i === 7 && valueWithoutNonDigits[i + 1] !== undefined)
      formattedValue += `-${valueWithoutNonDigits[i]}`;
    else formattedValue += valueWithoutNonDigits[i];
  }

  return formattedValue;
}

import { nanoid } from "nanoid";

export const generateNewId = () => nanoid(8);

export const formatCurrency = (value: number) => {
  const locale = Intl.DateTimeFormat().resolvedOptions().locale;

  const currencyNumberFormat = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
  });

  return currencyNumberFormat.format(value);
};

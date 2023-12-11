import { format, formatDistance } from "date-fns";
import viLocale from "date-fns/locale/vi";

export const formatCurrency = (number) => {
  const VND = new Intl.NumberFormat("vi-vn", {
    style: "currency",
    currency: "VND",
  }).format(number);

  return VND;
};

export const timeAgo = (date) => {
  const ago = formatDistance(date, new Date(), {
    addSuffix: true,
    locale: viLocale,
  });

  const str = `${format(date, "dd/MM/yyyy")} (${ago})`;

  return str;
};

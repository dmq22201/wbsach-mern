export const formatCurrency = (number) => {
  const VND = new Intl.NumberFormat("vi-vn", {
    style: "currency",
    currency: "VND",
  }).format(number);

  return VND;
};

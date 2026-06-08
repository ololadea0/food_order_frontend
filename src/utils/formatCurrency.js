const nairaFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 2,
});

export const formatCurrency = (value = 0) =>
  nairaFormatter.format(Number(value) || 0);

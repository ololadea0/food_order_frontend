const getPrepTimes = (items = []) =>
  items
    .map((item) => item?.preparationTime ?? item?.food?.preparationTime ?? 0)
    .filter((time) => Number.isFinite(time) && time > 0);

export const getEstimatedPrepTime = (items = []) => {
  const prepTimes = getPrepTimes(items);

  if (prepTimes.length === 0) {
    return 15;
  }

  // Kitchen prep can happen in parallel for many orders, so the longest item
  // gives a better customer estimate than summing every item.
  return Math.max(...prepTimes);
};

export const getEstimatedOrderWindow = (items = [], orderType = "delivery") => {
  const prepTime = getEstimatedPrepTime(items);
  const extraMinutes = orderType === "delivery" ? 15 : 5;
  return `${prepTime}-${prepTime + extraMinutes} minutes`;
};

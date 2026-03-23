export const extractList = (payload, candidates = []) => {
  if (Array.isArray(payload)) return payload;

  const defaultKeys = ["items", "products", "orders", "users", "notifications", "featureRequests", "recentRequests"];
  const keys = [...candidates, ...defaultKeys];

  for (const key of keys) {
    if (Array.isArray(payload?.[key])) return payload[key];
    if (Array.isArray(payload?.data?.[key])) return payload.data[key];
  }

  if (Array.isArray(payload?.data?.items)) return payload.data.items;

  return [];
};

export const extractOne = (payload) => payload?.data ?? payload;

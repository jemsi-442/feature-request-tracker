export const toPlain = (row) => {
  if (!row) return null;
  return typeof row.toJSON === "function" ? row.toJSON() : row;
};

export const serializeUser = (row, { includePassword = false } = {}) => {
  const user = toPlain(row);
  if (!user) return null;

  const out = {
    ...user,
    _id: user.id,
  };

  if (!includePassword) {
    delete out.password;
  }

  return out;
};

export const serializeFeatureRequest = (row) => {
  const featureRequest = toPlain(row);
  if (!featureRequest) return null;

  const creator = featureRequest.creator
    ? {
        ...featureRequest.creator,
        _id: featureRequest.creator.id,
      }
    : null;

  const updater = featureRequest.updater
    ? {
        ...featureRequest.updater,
        _id: featureRequest.updater.id,
      }
    : null;

  return {
    ...featureRequest,
    _id: featureRequest.id,
    createdAt: featureRequest.createdAt || featureRequest.created_at || null,
    updatedAt: featureRequest.updatedAt || featureRequest.updated_at || null,
    creator,
    updater,
  };
};

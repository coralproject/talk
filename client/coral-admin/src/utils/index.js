export const isPremod = mod => mod === 'PRE';

export const getModPath = (type = 'all', assetId) =>
  assetId ? `/admin/moderate/${type}/${assetId}` : `/admin/moderate/${type}`;

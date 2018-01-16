import LinkifyIt from 'linkify-it';
import tlds from 'tlds';
const linkify = new LinkifyIt();
linkify.tlds(tlds);

export function matchLinks(text) {
  return linkify.match(text);
}

export const isPremod = mod => mod === 'PRE';

export const getModPath = (type = 'all', assetId) =>
  assetId ? `/admin/moderate/${type}/${assetId}` : `/admin/moderate/${type}`;

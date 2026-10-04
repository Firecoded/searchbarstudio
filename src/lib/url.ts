// Admin-entered links are often typed without a scheme ("example.com"), which
// an <a href> would resolve relative to the current page.
export function externalUrl(value: string | null | undefined) {
  const v = value?.trim();
  if (!v) return null;
  return /^(https?:\/\/|mailto:)/i.test(v) ? v : `https://${v.replace(/^\/+/, "")}`;
}

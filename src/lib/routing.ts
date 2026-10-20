/** Keep application links inside the Vite deployment prefix. */
export function appPath(path = ""): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
}

export function getSharedRouteToken(pathname: string): string | null {
  const base = import.meta.env.BASE_URL;
  if (!pathname.startsWith(base)) return null;
  const match = pathname.slice(base.length).match(/^shared\/([^/]+)\/?$/);
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

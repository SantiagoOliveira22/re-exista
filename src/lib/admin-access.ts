export function generateAdminAccessToken(key: string): string {
  return Buffer.from(`re-exista-admin:${key}`).toString("base64");
}

export function isValidAdminAccessCookie(
  cookieValue: string | undefined,
): boolean {
  const adminAccessKey = process.env.ADMIN_ACCESS_KEY;
  if (!adminAccessKey || !cookieValue) return false;
  return cookieValue === generateAdminAccessToken(adminAccessKey);
}

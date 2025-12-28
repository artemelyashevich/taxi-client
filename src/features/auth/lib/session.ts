export function setAuthCookies(accessToken: string, refreshToken: string) {
    document.cookie = `session_token=${accessToken}; path=/; max-age=86400`;
    document.cookie = `refresh_token=${refreshToken}; path=/; max-age=604800`;
}
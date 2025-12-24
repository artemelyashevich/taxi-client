export function setAuthCookies(accessToken: string, refreshToken: string) {
    document.cookie = `session_token=${accessToken}; path=/`;
    document.cookie = `refresh_token=${refreshToken}; path=/`;
}
export interface UserJWT {
    roles: string[];
    loginProvider: string;
    iat: number;
    exp: number;
    sub: string;
    refreshToken: string;
}

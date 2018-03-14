export interface AuthenticatedUser {
    id: string;
    isAnonymous: boolean;
    roles: string[];
    email: string | null;
    authProviders: string[];
}

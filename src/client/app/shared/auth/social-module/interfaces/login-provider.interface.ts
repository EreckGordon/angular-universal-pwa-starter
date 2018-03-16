import { SocialUser } from '../classes/social-user.class';

export interface LoginProvider {
    initialize(): Promise<SocialUser>;
    signIn(): Promise<SocialUser>;
    signOut(): Promise<any>;
}

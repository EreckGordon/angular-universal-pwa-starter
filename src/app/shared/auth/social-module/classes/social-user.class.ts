export class SocialUser {
    provider: string;
    socialUid: string;
    email: string;
    name: string;
    photoUrl: string;
    firstName: string;
    lastName: string;
    accessToken: string;
    idToken: string; // Reference https://developers.google.com/identity/sign-in/web/backend-auth
}

import { User } from '../user.entity';

export interface UserSessionAndCSRFToken {
    user: User;
    sessionToken: string;
    csrfToken: string;
}

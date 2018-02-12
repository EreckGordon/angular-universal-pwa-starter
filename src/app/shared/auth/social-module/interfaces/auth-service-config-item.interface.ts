import { LoginProvider } from './login-provider.interface';

export interface AuthServiceConfigItem {
    id: string;
    provider: LoginProvider;
}

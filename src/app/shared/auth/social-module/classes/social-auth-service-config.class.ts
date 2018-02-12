import { LoginProvider } from '../interfaces/login-provider.interface';
import { AuthServiceConfigItem } from '../interfaces/auth-service-config-item.interface';

export class SocialAuthServiceConfig {
    providers: Map<string, LoginProvider> = new Map<string, LoginProvider>();

    constructor(providers: AuthServiceConfigItem[]) {
        for (let i = 0; i < providers.length; i++) {
            let element = providers[i];
            this.providers.set(element.id, element.provider);
        }
    }
}

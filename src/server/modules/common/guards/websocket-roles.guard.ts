import { Guard, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Observable } from 'rxjs/Observable';

import { AuthService } from '../../auth/auth.service';

@Guard()
export class WebsocketRolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector, private readonly authService: AuthService) {}

    async canActivate(data, context: ExecutionContext): Promise<boolean> {
        const { parent, handler } = context;
        const roles = this.reflector.get<string[]>('roles', handler);
        if (!roles) {
            // if you don't request a certain role, you return true so the guard doesn't break your other routes.
            return true;
        }
        if (data.uuid === null) {
            // entering null into a user repository will give first user created in db, this would be bad
            return false;
        }

        const user = await this.authService.findUserByUuid(data.uuid);
        const hasRole = () => !!user.roles.find(role => !!roles.find(item => item === role));
        return user && user.roles && hasRole();
    }
}

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs/Observable';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest();
        const handler = context.getHandler();

        const roles = this.reflector.get<string[]>('roles', handler);
        if (!roles) {
            return true; // if you don't request a certain role, you return true so the guard doesn't break your other routes.
        }
        const user = req.user;
        const hasRole = () => !!user.roles.find(role => !!roles.find(item => item === role));
        return user && user.roles && hasRole();
    }
}

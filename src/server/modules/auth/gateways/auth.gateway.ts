import { WebSocketGateway, SubscribeMessage, WsResponse, WebSocketServer, NestGateway } from '@nestjs/websockets';

import * as cookie from 'cookie';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { of } from 'rxjs/observable/of';

import { SecurityService } from '../../common/security/security.service';

import { AuthCache } from '../auth.cache';

@WebSocketGateway({ namespace: 'api/auth/gateway', port: 8001 })
export class AuthGateway implements NestGateway {
    requiredRolesForGateway = ['anon', 'user']; // match any role and you have access
    recentlyCreatedAnonEvent = 'recently-created-anon';
    // requiredRolesForRecentlyCreatedAnonEvent = ['user']; // add this for granular role check

    constructor(private readonly authCache: AuthCache, private readonly securityService: SecurityService) {}

    @WebSocketServer() server;

    async handleConnection(client) {
        const parsedCookies = cookie.parse(client.request.headers.cookie);
        const userCookie = parsedCookies['SESSIONID'];
        if (!userCookie) {
            return client.disconnect();
        }
        const user = await this.securityService.decodeJwt(userCookie);
        const canAccess = this.roleGuard(user.roles, this.requiredRolesForGateway);
        if (!canAccess) {
            return client.disconnect();
        }
        client.user = user;
    }

    @SubscribeMessage('recently-created-anon')
    onRecentlyCreatedAnon(client, data): Observable<WsResponse<any>> {
        /*
        * we can also do granular role guarding
        *
        * depending on what kind of action this socket is, we may want to check that the user exists in db before performing any action.
        * however, I have chosen to not check the db for normal type of interactions because the guard does not come without a cost.
        *
        const hasRole = this.roleGuard(client.user.roles, this.requiredRolesForRecentlyCreatedAnonEvent);
        if (!hasRole) {
            return of({ event: this.recentlyCreatedAnonEvent, data: [] });
        }
        */
        return this.authCache.wsObservable.pipe(map(res => ({ event: this.recentlyCreatedAnonEvent, data: res })));
    }

    private roleGuard(roles: string[], requiredRoles: string[]): boolean {
        return !!roles.find(role => !!requiredRoles.find(item => item === role));
    }
}

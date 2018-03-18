import { WebSocketGateway, SubscribeMessage, WsResponse, WebSocketServer, NestGateway } from '@nestjs/websockets';

import * as cookie from 'cookie';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { of } from 'rxjs/observable/of';

import { SecurityService } from '../common/security/security.service';

import { AuthCache } from './auth.cache';

@WebSocketGateway({ namespace: 'api/auth/gateway', port: 8001 })
export class AuthGateway implements NestGateway {
    recentlyCreatedAnonEvent = 'recently-created-anon';
    requiredRolesForRecentlyCreatedAnonEvent = ['anon', 'user']; // if the user has any of these roles then they are authorized to view the stream

    constructor(private readonly authCache: AuthCache, private readonly securityService: SecurityService) {}

    @WebSocketServer() server;

    async handleConnection(client) {
        const parsedCookies = cookie.parse(client.request.headers.cookie);
        const userCookie = parsedCookies['SESSIONID'];
        if (!userCookie) {
            return (client.user = { roles: [''] });
        }
        const user = await this.securityService.decodeJwt(userCookie);
        client.user = user;
    }

    @SubscribeMessage('recently-created-anon')
    onRecentlyCreatedAnon(client, data): Observable<WsResponse<any>> {
        const hasRole = this.roleGuard(client, this.requiredRolesForRecentlyCreatedAnonEvent);
        if (!hasRole) {
            return of({ event: this.recentlyCreatedAnonEvent, data: [] });
        }
        return this.authCache.wsObservable.pipe(map(res => ({ event: this.recentlyCreatedAnonEvent, data: res })));
    }

    private roleGuard(client, requiredRoles): boolean {
        return !!client.user.roles.find(role => !!requiredRoles.find(item => item === role));
    }
}

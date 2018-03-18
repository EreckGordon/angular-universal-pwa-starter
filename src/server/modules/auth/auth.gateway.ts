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
    requiredRoles = ['user']; // if the user has any of these roles then they are authorized to view the stream

    constructor(private readonly authCache: AuthCache, private readonly securityService: SecurityService) {}

    @WebSocketServer() server;

    async handleConnection(client) {
        const parsedCookies = cookie.parse(client.request.headers.cookie);
        const user = await this.securityService.decodeJwt(parsedCookies['SESSIONID']);
        client.user = user;
    }

    @SubscribeMessage('recently-created-anon')
    onRecentlyCreatedAnon(client, data): Observable<WsResponse<any>> {
        const hasRole = !!client.user.roles.find(role => !!this.requiredRoles.find(item => item === role));
        if (!hasRole) {
            return of({ event: this.recentlyCreatedAnonEvent, data: [] });
        }
        return this.authCache.wsObservable.pipe(map(res => ({ event: this.recentlyCreatedAnonEvent, data: res })));
    }
}

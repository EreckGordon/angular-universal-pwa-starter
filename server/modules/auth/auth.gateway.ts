import { WebSocketGateway, SubscribeMessage, WsResponse, WebSocketServer, WsException } from '@nestjs/websockets';

import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';

import { AuthCache } from './auth.cache';

@WebSocketGateway({ namespace: 'api/auth/gateway', port: 8001 })
export class AuthGateway {
    constructor(private readonly authCache: AuthCache) {}
    @WebSocketServer() server;

    @SubscribeMessage('recently-created-anon')
    onRecentlyCreatedAnon(): Observable<WsResponse<any>> {
        const event = 'recently-created-anon';
        return this.authCache.wsObservable.pipe(map(res => ({ event, data: res })));
    }
}

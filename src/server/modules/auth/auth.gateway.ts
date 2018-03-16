import { WebSocketGateway, SubscribeMessage, WsResponse, WebSocketServer } from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';

import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';

import { WebsocketRolesGuard } from '../common/guards/websocket-roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

import { AuthCache } from './auth.cache';

@WebSocketGateway({ namespace: 'api/auth/gateway', port: 8001 })
@UseGuards(WebsocketRolesGuard)
export class AuthGateway {
    constructor(private readonly authCache: AuthCache) {}
    @WebSocketServer() server;

    @Roles('anon')
    @SubscribeMessage('recently-created-anon')
    onRecentlyCreatedAnon(): Observable<WsResponse<any>> {
        const event = 'recently-created-anon';
        return this.authCache.wsObservable.pipe(map(res => ({ event, data: res })));
    }
}

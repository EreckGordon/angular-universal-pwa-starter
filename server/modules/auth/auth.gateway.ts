import { WebSocketGateway, SubscribeMessage, WsResponse, WebSocketServer, WsException } from '@nestjs/websockets';

import { EventSubscriber, EntitySubscriberInterface, InsertEvent, RemoveEvent, UpdateEvent } from 'typeorm';

import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import 'rxjs/add/operator/map';

import { AuthCache } from './auth.cache';

@WebSocketGateway({ namespace: 'api/auth/gateway', port: 8001 })
export class AuthGateway {
    constructor(private readonly authCache: AuthCache) {}
    @WebSocketServer() server;

    @SubscribeMessage('recently-created-anon')
    onEvent2(): Observable<WsResponse<any>> {
        const event = 'recently-created-anon';
        return this.authCache.wsObservable.pipe(map(res => ({ event, data: res })));
    }
}

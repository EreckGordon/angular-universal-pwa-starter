import {
    WebSocketGateway,
    SubscribeMessage,
    WsResponse,
    WebSocketServer,
    NestGateway,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';

import * as socketIO from 'socket.io';

import * as cookie from 'cookie';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { of } from 'rxjs/observable/of';

import { SecurityService } from '../../common/security/security.service';

import { ChatCache } from '../chat.cache';
import { ChatService } from '../chat.service';
import { UserJWT } from '../../auth/interfaces/user-JWT.interface';

@WebSocketGateway(8002, { namespace: '/api/chat/gateway' })
export class ChatGateway implements NestGateway, OnGatewayConnection {
    requiredRolesForGateway = ['anon', 'user']; // match any role and you have access
    recentlyCreatedAnonEvent = 'recently-created-anon';
    requiredRolesForAdminRoute = ['admin']; // add this for granular role check

    constructor(
        private readonly chatCache: ChatCache,
        private readonly securityService: SecurityService,
        private readonly chatService: ChatService
    ) {}

    @WebSocketServer() server: SocketIO.Namespace;

    async handleConnection(client: SocketIO.Socket) {
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
        client['user'] = user;
        client.emit('message', 'successfully connected to api/chat/gateway websocket');

        // look up user see what chatrooms they are a member of, and join those rooms
        // something like:
        // user.chatrooms.forEach(chatroom => {
        //    this.chatService.findChatroomById(chatroom.id)
        //        .then(room => client.emit('join-room', {roomName: room.name}))
        // })
    }

    @SubscribeMessage('join-chatroom')
    async onJoinChatroom(client: SocketIO.Socket, data: { roomName: string }) {
        const user: UserJWT = client['user'];
        const chatroom = await this.chatService.findChatroomByName(data.roomName);

        if (chatroom === undefined) {
            // disconnect from other chatrooms, currently doing this for simplicity. git rid of this in future
            client.leaveAll();
            const newlyCreatedChatroom = await this.chatService.createChatroom(data.roomName, user);
            client.join(newlyCreatedChatroom.name);
            return client.emit('message', newlyCreatedChatroom);
        }

        // disconnect from other chatrooms, currently doing this for simplicity. git rid of this in future
        client.leaveAll();

        // add user to the chatroom db listing
        // connect to chat room

        // add user to table of chatrooms. this way they auto join in future. need some other magic too once i figure it out...
        // this.chatService.addUserToChatroom
        client.join(chatroom.name);
        // send contents of room to user
        return client.emit('message', chatroom);

        /*
        * this is the implementation for in memory db. lets now use the real db.
        *
        //give newly connected member contents of room (assuming it exists)
        if (this.chatCache.currentValue()[data.roomName]){
            client.emit('message', this.chatCache.currentValue()[data.roomName])
        }
        else {
            client.emit('message', `new room: ${data.roomName}`)
        }
        *
        * end of in memory db
        */
    }

    @SubscribeMessage('message')
    async onRecentlyCreatedAnon(client: SocketIO.Socket, data: { roomName: string; message: string }) {
        /*
        * more in memory db impl
        *
        // add the message to the cache (for when new users join they can get all historical messages)
        this.chatCache.addData({
            message: data.message,
            messageId: Date.now(),
            roomId: 1,
            roomName: data.roomName,
            sender: '',
            senderId: '',
            timestamp: 1
        })
        // emit message to user, they concat to their chatlog
        return this.server.to(data.roomName).emit('message', data.message)
        *
        * end of in memory db
        */

        const savedMessage = await this.chatService.addMessage(data, client['user']);

        // emit the message, for user to concat it to their chatlog
        return this.server.to(data.roomName).emit('message', savedMessage);
    }

    private roleGuard(roles: string[], requiredRoles: string[]): boolean {
        return roles.some(role => !!requiredRoles.find(item => item === role));
    }
}

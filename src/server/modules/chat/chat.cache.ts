import { Injectable } from '@nestjs/common';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

interface RoomsCache {
    [roomName: string]: {
        roomId: number;
        [messageId: number]: MessageData;
    };
}

interface MessageData {
    message: string;
    timestamp: number;
    sender: string;
    senderId: string;
}

interface UnparsedMessageData {
    roomName: string;
    roomId: number;
    messageId: number;
    message: string;
    sender: string;
    senderId: string;
    timestamp: number;
}

@Injectable()
export class ChatCache {
    private chatBehaviorSubject: BehaviorSubject<RoomsCache> = new BehaviorSubject<RoomsCache>({});

    chatObservable: Observable<any> = this.chatBehaviorSubject.asObservable();

    currentValue() {
        return this.chatBehaviorSubject.getValue();
    }

    // used as in memory db, rather than full db integration
    addData(data: UnparsedMessageData) {
        const state = this.currentValue();
        this.chatBehaviorSubject.next({
            ...state,
            [data.roomName]: {
                roomId: data.roomId,
                [data.messageId]: {
                    message: data.message,
                    sender: data.sender,
                    senderId: data.senderId,
                    timestamp: data.timestamp,
                },
                ...state[data.roomName],
            },
        });
    }
}

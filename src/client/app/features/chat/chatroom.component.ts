import { Component, OnInit, OnDestroy, Injector, PLATFORM_ID, Inject, Input } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { Subject, BehaviorSubject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { TitleAndMetaTags } from '@interfaces/title-and-meta-tags.interface';
import { SEOService } from '@seo/seo.service';

import { ChatService } from './chat.service';

@Component({
    selector: 'app-chatroom',
    templateUrl: './chatroom.component.html',
})
export class ChatroomComponent implements OnInit, OnDestroy {
    destroy = new Subject();
    titleAndMetaTags = {
        title: 'Angular Universal PWA Starter - Chat',
        description: 'Live chat powered by websockets.',
    };
    chatService: ChatService;
    currentChatroomBehaviorSubject: BehaviorSubject<string> = new BehaviorSubject(this.route.snapshot.params['roomName']);
    currentChatroom = this.currentChatroomBehaviorSubject.asObservable();

    constructor(
        private seoService: SEOService,
        private injector: Injector,
        @Inject(PLATFORM_ID) private platformId: Object,
        public router: Router,
        public route: ActivatedRoute
    ) {
        this.seoService.setTitleAndMetaTags(this.titleAndMetaTags);
        if (isPlatformBrowser(this.platformId)) {
            this.chatService = this.injector.get(ChatService);
        }
    }

    ngOnInit() {
        this.chatService.joinRoom(this.currentChatroomBehaviorSubject.getValue());
        this.router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                takeUntil(this.destroy)
            )
            .subscribe(event => {
                this.currentChatroomBehaviorSubject.next(this.route.snapshot.params['roomName']);
                console.log(this.currentChatroomBehaviorSubject.getValue());
                this.chatService.joinRoom(this.currentChatroomBehaviorSubject.getValue());
            });
    }

    sendMessage(message) {
        this.chatService.sendMessage({ message, roomName: this.currentChatroomBehaviorSubject.getValue() });
    }

    ngOnDestroy() {
        this.destroy.next();
    }
}

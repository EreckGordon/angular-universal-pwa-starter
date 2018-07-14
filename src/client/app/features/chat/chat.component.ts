import { Component, OnInit, OnDestroy, Injector, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { Subject, BehaviorSubject, Observable, of } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { TitleAndMetaTags } from '@interfaces/title-and-meta-tags.interface';
import { SEOService } from '@seo/seo.service';

import { ChatService } from './chat.service';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
})
export class ChatComponent implements OnInit, OnDestroy {
    destroy = new Subject();
    titleAndMetaTags = {
        title: 'Angular Universal PWA Starter - Chat',
        description: 'Live chat powered by websockets.',
    };
    // prettier-ignore
    jsonLdSchema = {
        '@context': 'https://schema.org/'
    };
    chatService: ChatService;
    isMainChatRouteSubject: BehaviorSubject<boolean> = new BehaviorSubject(this.router.url.endsWith('chat'));
    isMainChatRoute = this.isMainChatRouteSubject.asObservable();

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
        this.router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                takeUntil(this.destroy)
            )
            .subscribe(event => this.isMainChatRouteSubject.next(this.router.url.endsWith('chat')));
    }

    ngOnDestroy() {
        this.destroy.next();
    }
}

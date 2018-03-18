import { Component, OnInit, Injector, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { TitleAndMetaTags } from '@interfaces/title-and-meta-tags.interface';
import { SEOService } from '@seo/seo.service';

import { ChatService } from './chat.service';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
})
export class ChatComponent implements OnInit {
    titleAndMetaTags = {
        title: 'Angular Universal PWA Starter - Chat',
        description: 'Live chat powered by websockets.',
    };
    // prettier-ignore
    jsonLdSchema = {
        '@context': 'https://schema.org/'
    };
    chatService: ChatService;

    constructor(private seoService: SEOService, private injector: Injector, @Inject(PLATFORM_ID) private platformId: Object) {
        this.seoService.setTitleAndMetaTags(this.titleAndMetaTags);
        if (isPlatformBrowser(this.platformId)) {
            this.chatService = this.injector.get(ChatService);
            this.chatService.emit();
        }
    }

    ngOnInit() {}

    emit() {
        this.chatService.emit();
    }
}

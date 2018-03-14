import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes } from './chat.routing';

import { JsonLdModule } from '@seo/json-ld.module';

import { ChatComponent } from './chat.component';
import { ChatService } from './chat.service';

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes), JsonLdModule],
    declarations: [ChatComponent],
    providers: [ChatService],
})
export class ChatModule {}

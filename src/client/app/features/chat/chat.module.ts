import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes } from './chat.routing';

import { JsonLdModule } from '@seo/json-ld.module';
import { CustomMaterialModule } from '../../shared/custom-material-module/index';

import { ChatComponent } from './chat.component';
import { ChatroomComponent } from './chatroom.component';
import { ChatService } from './chat.service';

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes), JsonLdModule, CustomMaterialModule],
    declarations: [ChatComponent, ChatroomComponent],
    providers: [ChatService],
})
export class ChatModule {}

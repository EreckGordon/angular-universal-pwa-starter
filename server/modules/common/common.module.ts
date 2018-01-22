import { Module } from '@nestjs/common';

import { SecurityService } from './security/security.service';
import { MailgunService } from './mailgun.service';


@Module({
    components: [
        SecurityService,
        MailgunService
    ],
    exports: [
        SecurityService,
        MailgunService
    ]
})
export class CommonModule { }

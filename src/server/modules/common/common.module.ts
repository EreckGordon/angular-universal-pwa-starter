import { Module } from '@nestjs/common';

import { SecurityService } from './security/security.service';
import { MailgunService } from './mailgun.service';
import { commonProviders } from './common.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
    imports: [DatabaseModule, ...commonProviders],
    providers: [SecurityService, MailgunService],
    exports: [SecurityService, MailgunService],
})
export class CommonModule {}

import { Module } from '@nestjs/common';

import { SecurityService } from './security/security.service';


@Module({
    components: [
        SecurityService
    ],
    exports: [SecurityService]
})
export class CommonModule { }

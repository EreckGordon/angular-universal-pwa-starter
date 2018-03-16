import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { ServerSideRenderingModule } from './server-side-rendering/server-side-rendering.module';

@Module({
    //awalys put ServerSideRenderingModule as last entry in array so it does not eat any GET requests.
    modules: [AuthModule, ServerSideRenderingModule],
})
export class ApplicationModule {}

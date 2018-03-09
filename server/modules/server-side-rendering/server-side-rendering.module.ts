import { Module } from '@nestjs/common';

import { ServerSideRenderingController } from './server-side-rendering.controller';

@Module({
    controllers: [ServerSideRenderingController],
})
export class ServerSideRenderingModule {}

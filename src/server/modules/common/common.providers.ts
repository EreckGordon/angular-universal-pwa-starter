import { RefreshToken } from './security/refresh-token.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

export const commonProviders = [TypeOrmModule.forFeature([RefreshToken])];

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { EmailAndPasswordProvider } from './email-and-password/email-and-password-provider.entity';
import { GoogleProvider } from './google/google-provider.entity';
import { FacebookProvider } from './facebook/facebook-provider.entity';

export const authProviders = [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([EmailAndPasswordProvider]),
    TypeOrmModule.forFeature([GoogleProvider]),
    TypeOrmModule.forFeature([FacebookProvider]),
];

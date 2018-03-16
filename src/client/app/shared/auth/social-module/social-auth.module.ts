import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { RecaptchaModule } from 'ng-recaptcha';
import { RecaptchaFormsModule } from 'ng-recaptcha/forms';

import { CustomMaterialModule } from '../../custom-material-module/index';
import { JsonLdModule } from '@seo/json-ld.module';

import { routes } from './social-auth.routing';
import { SocialAuthService } from './social-auth.service';
import { SocialAuthSignInComponent } from './components/social-auth-sign-in.component';
import { LinkSocialToAccountComponent } from './components/link-social-to-account.component';

@NgModule({
    declarations: [SocialAuthSignInComponent, LinkSocialToAccountComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        CustomMaterialModule,
        ReactiveFormsModule,
        RecaptchaModule,
        RecaptchaFormsModule,
        JsonLdModule,
    ],
    providers: [SocialAuthService],
})
export class SocialAuthModule {}

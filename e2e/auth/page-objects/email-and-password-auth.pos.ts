import { browser, by, element, $, $$, ExpectedConditions } from 'protractor';
import { SignInPage } from './sign-in.po';
import { CreateAccountPage } from './create-account.po';
import { RequestPasswordResetPage } from './request-password-reset.po';
import { AccountManagementPage } from './account-management.po';
import { DeleteAccountPage } from './delete-account.po';

export class EmailAndPasswordAuthPages {
    signInPage: SignInPage = new SignInPage();
    createAccountPage: CreateAccountPage = new CreateAccountPage();
    requestPasswordResetPage: RequestPasswordResetPage = new RequestPasswordResetPage();
    accountManagementPage: AccountManagementPage = new AccountManagementPage();
    deleteAccountPage: DeleteAccountPage = new DeleteAccountPage();

    getEmailInput() {
        return $('input[formcontrolname=email]');
    }

    getPasswordInput() {
        return $('input[formcontrolname=password]');
    }

    getRecaptcha() {
        return $('re-captcha');
    }

    getCurrentUrl() {
        return browser.getCurrentUrl();
    }
}

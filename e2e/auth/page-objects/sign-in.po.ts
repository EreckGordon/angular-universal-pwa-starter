import { browser, by, element, $, $$, ExpectedConditions } from 'protractor';
// $ = element(by.css())
// $$ = element.all(by.css())

export class SignInPage {
    navigateToSignIn() {
        return browser.get('/sign-in');
    }

    getRecaptcha() {
        return $('re-captcha');
    }

    getLoginButton() {
        return $$('button').filter(button => button.getText().then(text => text === 'Login'));
    }

    waitForLoginToBeClickable() {
        return browser.wait(ExpectedConditions.elementToBeClickable(this.getLoginButton().get(0)));
    }
}

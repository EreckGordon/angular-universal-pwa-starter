import { browser, by, element, $, $$, ExpectedConditions } from 'protractor';
// $ = element(by.css())
// $$ = element.all(by.css())

export class SignInPage {
    navigateToSignIn() {
        return browser.get('/sign-in');
    }

    getHeaderText() {
        return element(by.tagName('h3')).getText();
    }

    getEmailInput() {
        return $('input[formcontrolname=email]');
    }

    getPasswordInput() {
        return $('input[formcontrolname=password]');
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

    getCurrentUrl() {
        return browser.getCurrentUrl();
    }
}

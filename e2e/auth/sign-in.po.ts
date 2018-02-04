import { browser, by, element, $$ } from 'protractor';

export class SignInPage {
    navigateTo() {
        return browser.get('/sign-in');
    }

    getHeaderText() {
        return element(by.tagName('h3')).getText();
    }

    getEmailInput() {
        return element(by.css('input[formcontrolname=email]'));
    }

    getPasswordInput() {
        return element(by.css('input[formcontrolname=password]'));
    }

    getRecaptcha() {
        return element(by.className('rc-anchor'));
    }
}

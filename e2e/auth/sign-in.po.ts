import { browser, by, element, $$, ExpectedConditions } from 'protractor';

export class SignInPage {
    navigateToSignIn() {
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
        return element(by.css('re-captcha'));
    }

    getLoginButton() {
        return $$('button').filter(button => button.getText().then(text => text === 'Login'))
    }

    waitForLoginToBeClickable() {
        return browser.wait(ExpectedConditions.elementToBeClickable(this.getLoginButton().get(0)))
    }    

    getCurrentUrl() {
        return browser.getCurrentUrl()
    }

}

import { browser, by, element, $, $$, ExpectedConditions } from 'protractor';
// $ = element(by.css())
// $$ = element.all(by.css())

export class CreateAccountPage {
    navigateToSignIn() {
        return browser.get('/create-account');
    }

    getCreateAccountButton() {
        return $$('button').filter(button =>
            button.getText().then(text => text === 'Create Account')
        );
    }

    waitForCreateAccountToBeClickable() {
        return browser.wait(
            ExpectedConditions.elementToBeClickable(this.getCreateAccountButton().get(0))
        );
    }
}

import { browser, by, element, $, $$, ExpectedConditions } from 'protractor';
// $ = element(by.css())
// $$ = element.all(by.css())

export class RequestPasswordResetPage {
    navigateToRequestPasswordReset() {
        return browser.get('/request-password-reset');
    }

    getRequestPasswordResetButton() {
        return $$('button').filter(button =>
            button.getText().then(text => text === 'Request Password Reset')
        );
    }

    waitForRequestPasswordResetToBeClickable() {
        return browser.wait(
            ExpectedConditions.elementToBeClickable(this.getRequestPasswordResetButton().get(0))
        );
    }
}

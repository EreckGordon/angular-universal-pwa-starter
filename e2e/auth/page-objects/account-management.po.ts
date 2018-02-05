import { browser, by, element, $, $$, ExpectedConditions } from 'protractor';
// $ = element(by.css())
// $$ = element.all(by.css())
export class AccountManagementPage {
    navigateToAccountManagement() {
        return browser.get('/account');
    }

    getDeleteAccountButton() {
        return $$('button').filter(button =>
            button.getText().then(text => text === 'Delete Account')
        );
    }
}

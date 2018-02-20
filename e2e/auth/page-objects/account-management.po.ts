import { browser, by, element, $, $$, ExpectedConditions } from 'protractor';
// $ = element(by.css())
// $$ = element.all(by.css())

export class AccountManagementPage {
    navigateToAccountManagement() {
        return browser.get('/account');
    }

    getLogOutButton() {
        return $$('button').filter(button => button.getText().then(text => text === 'Log Out'));
    }

    getChangePasswordButton() {
        return $$('button').filter(button => button.getText().then(text => text === 'Change Password'));
    }

    getCancelChangePasswordButton() {
        return $$('button').filter(button => button.getText().then(text => text === 'Cancel'));
    }

    getDeleteAccountButton() {
        return $$('button').filter(button => button.getText().then(text => text === 'Delete Account'));
    }
}

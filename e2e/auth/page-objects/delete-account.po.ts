import { browser, by, element, $, $$, ExpectedConditions } from 'protractor';
// $ = element(by.css())
// $$ = element.all(by.css())

export class DeleteAccountPage {
    getDeleteAccountButton() {
        return $$('button').filter(button =>
            button.getText().then(text => text === 'Delete Account')
        );
    }

    getConfirmDeleteAccountButton() {
        return $$('button').filter(button => button.getText().then(text => text === 'Yes'));
    }
}

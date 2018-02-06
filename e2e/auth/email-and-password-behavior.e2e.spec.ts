import { EmailAndPasswordAuthPages } from './page-objects/email-and-password-auth.pos';

describe('Email and Password User Behavior', () => {
    const auth: EmailAndPasswordAuthPages = new EmailAndPasswordAuthPages();
    const validEmail = 'totally-real-user@legitimate-email.com';
    const invalidEmail = 'give-me-an-account';
    const validPassword = 'totallyRealPassword';
    const invalidPasswordTooShort = 'letMeIn';
    const invalidPasswordTypo = 'totallyrealPassword';

    const enterEmailPasswordAndCaptcha = (email: string, password: string) => {
        auth.getEmailInput().sendKeys(email);
        auth.getPasswordInput().sendKeys(password);
        auth.getRecaptcha().click();
    };

    it('attempt to create account and fail: invalid email', () => {
        auth.createAccountPage.navigateToSignIn();
        enterEmailPasswordAndCaptcha(invalidEmail, validPassword);
        auth.createAccountPage
            .getCreateAccountButton()
            .getAttribute('ng-reflect-disabled')
            .then(isDisabled => expect(isDisabled[0]).toBe('true'));
    });

    it('attempt to create account and fail: password too short', () => {
        auth.createAccountPage.navigateToSignIn();
        enterEmailPasswordAndCaptcha(validEmail, invalidPasswordTooShort);
        auth.createAccountPage.waitForCreateAccountToBeClickable();
        auth.createAccountPage.getCreateAccountButton().click();
        auth.createAccountPage
            .getCreateAccountButton()
            .getAttribute('ng-reflect-disabled')
            .then(isDisabled => expect(isDisabled[0]).toBe('true'));
    });

    it('create account', () => {
        auth.createAccountPage.navigateToSignIn();
        enterEmailPasswordAndCaptcha(validEmail, validPassword);
        auth.createAccountPage.waitForCreateAccountToBeClickable();
        auth.createAccountPage.getCreateAccountButton().click();
        auth.getCurrentUrl().then(url => expect(url).toBe('http://localhost:4200/account'));
    });

    it('log out', () => {});

    it('attempt to create account and fail: email taken', () => {});

    it('attempt to log in and fail: wrong password', () => {});

    it('log in', () => {});

    it('attempt to change password and fail: wrong password', () => {});

    it('attempt to change password and fail: password too short', () => {});

    it('change password', () => {});

    it('delete account', () => {
        auth.accountManagementPage.navigateToAccountManagement();
        auth.accountManagementPage.getDeleteAccountButton().click();
        auth.deleteAccountPage.getDeleteAccountButton().click();
        auth.deleteAccountPage.getConfirmDeleteAccountButton().click();
        auth.sleep(500);
        auth.getCurrentUrl().then(url => expect(url).toBe('http://localhost:4200/'));
    });

    it('attempt to login and fail: account does not exist', () => {});

    it('attempt password reset request and fail: email does not exist', () => {});

    it('request password reset', () => {});
});

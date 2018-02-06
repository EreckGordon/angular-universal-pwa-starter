import { EmailAndPasswordAuthPages } from './page-objects/email-and-password-auth.pos';

describe('Email and Password User Behavior', () => {
    const auth: EmailAndPasswordAuthPages = new EmailAndPasswordAuthPages();
    const validEmail = 'totally-real-user@legitimate-email.com';
    const invalidEmail = 'give-me-an-account';
    const validPassword = 'totallyRealPassword';
    const newPassword = 'totallyRealPassword-new';
    const invalidPasswordTooShort = 'letMeIn';
    const invalidPasswordTypo = 'totallyrealPassword';

    const enterEmailPasswordAndCaptcha = (email: string, password: string) => {
        auth.getEmailInput().sendKeys(email);
        auth.getPasswordInput().sendKeys(password);
        auth.getRecaptcha().click();
    };

    it('attempt to create account and fail: invalid email', () => {
        auth.createAccountPage.navigateToCreateAccount();
        enterEmailPasswordAndCaptcha(invalidEmail, validPassword);
        auth.createAccountPage
            .getCreateAccountButton()
            .getAttribute('ng-reflect-disabled')
            .then(isDisabled => expect(isDisabled[0]).toBe('true'));
    });

    it('attempt to create account and fail: password too short', () => {
        auth.createAccountPage.navigateToCreateAccount();
        enterEmailPasswordAndCaptcha(validEmail, invalidPasswordTooShort);
        auth.createAccountPage.waitForCreateAccountToBeClickable();
        auth.createAccountPage.getCreateAccountButton().click();
        auth.createAccountPage
            .getCreateAccountButton()
            .getAttribute('ng-reflect-disabled')
            .then(isDisabled => expect(isDisabled[0]).toBe('true'));
    });

    it('create account', () => {
        auth.createAccountPage.navigateToCreateAccount();
        enterEmailPasswordAndCaptcha(validEmail, validPassword);
        auth.createAccountPage.waitForCreateAccountToBeClickable();
        auth.createAccountPage.getCreateAccountButton().click();
        auth.getCurrentUrl().then(url => expect(url).toBe('http://localhost:4200/account'));
    });

    it('log out', () => {
        auth.accountManagementPage.navigateToAccountManagement();
        auth.accountManagementPage.getLogOutButton().click();
        auth.getCurrentUrl().then(url => expect(url).toBe('http://localhost:4200/'));
    });

    it('attempt to create account and fail: email taken', () => {
        auth.createAccountPage.navigateToCreateAccount();
        enterEmailPasswordAndCaptcha(validEmail, validPassword);
        auth.createAccountPage.waitForCreateAccountToBeClickable();
        auth.createAccountPage.getCreateAccountButton().click();
        auth.getCurrentUrl().then(url => expect(url).toBe('http://localhost:4200/create-account'));
    });

    it('attempt to log in and fail: wrong password', () => {
        auth.signInPage.navigateToSignIn();
        enterEmailPasswordAndCaptcha(validEmail, invalidPasswordTypo);
        auth.signInPage.waitForLoginToBeClickable();
        auth.signInPage.getLoginButton().click();
        auth.getCurrentUrl().then(url => expect(url).toBe('http://localhost:4200/sign-in'));
    });

    it('log in', () => {
        auth.signInPage.navigateToSignIn();
        enterEmailPasswordAndCaptcha(validEmail, validPassword);
        auth.signInPage.waitForLoginToBeClickable();
        auth.signInPage.getLoginButton().click();
        auth.getCurrentUrl().then(url => expect(url).toBe('http://localhost:4200/account'));
    });

    it('cancel change password', () => {
        auth.accountManagementPage.navigateToAccountManagement();
        auth.accountManagementPage.getChangePasswordButton().click();
        auth.accountManagementPage.getCancelChangePasswordButton().click();
    });

    it('attempt to change password and fail: wrong password', () => {
        auth.accountManagementPage.navigateToAccountManagement();
        auth.accountManagementPage.getChangePasswordButton().click();
        auth.getOldPasswordInput().sendKeys(invalidPasswordTypo);
        auth.getNewPasswordInput().sendKeys(newPassword);
        auth.accountManagementPage.getChangePasswordButton().click();
        auth
            .getOldPasswordInput()
            .getAttribute('value')
            .then(inputValue => expect(inputValue).toBe(''));
    });

    it('attempt to change password and fail: password too short', () => {
        auth.accountManagementPage.navigateToAccountManagement();
        auth.accountManagementPage.getChangePasswordButton().click();
        auth.getOldPasswordInput().sendKeys(validPassword);
        auth.getNewPasswordInput().sendKeys(invalidPasswordTooShort);
        auth.accountManagementPage.getChangePasswordButton().click();
        auth
            .getNewPasswordInput()
            .getAttribute('value')
            .then(inputValue => expect(inputValue).toBe(''));
    });

    it('change password', () => {
        auth.accountManagementPage.navigateToAccountManagement();
        auth.accountManagementPage.getChangePasswordButton().click();
        auth.getOldPasswordInput().sendKeys(validPassword);
        auth.getNewPasswordInput().sendKeys(newPassword);
        auth.accountManagementPage.getChangePasswordButton().click();
        expect(auth.accountManagementPage.getCancelChangePasswordButton().count()).toBe(0);
        auth.getCurrentUrl().then(url => expect(url).toBe('http://localhost:4200/account'));
    });

    it('delete account', () => {
        auth.accountManagementPage.navigateToAccountManagement();
        auth.accountManagementPage.getDeleteAccountButton().click();
        auth.deleteAccountPage.getDeleteAccountButton().click();
        auth.deleteAccountPage.getConfirmDeleteAccountButton().click();
        auth.sleep(500);
        auth.getCurrentUrl().then(url => expect(url).toBe('http://localhost:4200/'));
    });

    it('attempt to login and fail: account does not exist', () => {
        auth.signInPage.navigateToSignIn();
        enterEmailPasswordAndCaptcha(validEmail, validPassword);
        auth.signInPage.waitForLoginToBeClickable();
        auth.signInPage.getLoginButton().click();
        auth.getCurrentUrl().then(url => expect(url).toBe('http://localhost:4200/sign-in'));
    });

    it('attempt password reset request and fail: email does not exist', () => {
        auth.requestPasswordResetPage.navigateToRequestPasswordReset();
        auth.getEmailInput().sendKeys(validEmail);
        auth.getRecaptcha().click();
        auth.requestPasswordResetPage.waitForRequestPasswordResetToBeClickable();
        auth.requestPasswordResetPage.getRequestPasswordResetButton().click();
        auth
            .getEmailInput()
            .getAttribute('value')
            .then(inputValue => expect(inputValue).toBe(''));
    });

    it(`to do: request password reset
            skipping until i decide what to do with this spam that this feature generates
            probably make a dummy gmail account, and give its credentials to dotenv
            then testing the full password reset functionality`, () => {});
});

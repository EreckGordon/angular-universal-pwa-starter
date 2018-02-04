import { SignInPage } from './sign-in.po';
import { environment } from '../../src/environments/environment';

describe('Angular Universal PWA Starter App', () => {
    let page: SignInPage;

    beforeEach(() => {
        page = new SignInPage();
        page.navigateTo();
    });

    it('should have a Header that says "Sign in"', () => {
        expect(page.getHeaderText()).toBe('Sign in');
    });

    // work in progress
    it('should attempt to login a non-existent user and fail', async () => {
        page.getEmailInput().sendKeys('fake@email.com');
        page.getPasswordInput().sendKeys('totallyRealPassword');
        //page.getRecaptcha().click()
        expect(page.getHeaderText()).toBe('Sign in');
    });
});

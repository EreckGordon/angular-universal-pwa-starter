import { SignInPage } from './sign-in.po';


describe('Sign In Page', () => {
    let page: SignInPage;

    beforeEach(() => {
        page = new SignInPage();
        page.navigateToSignIn();
    });

    it('should have a Header that says "Sign in"', () => {
        expect(page.getHeaderText()).toBe('Sign in');
    });

    const enterEmailPasswordAndCaptcha = (email:string, password:string) => {
        page.getEmailInput().sendKeys(email);
        page.getPasswordInput().sendKeys(password);
        page.getRecaptcha().click();
        page.waitForLoginToBeClickable();    
    }

    it('should enable login button after filling out login form', () => {
        enterEmailPasswordAndCaptcha('test-user@fake-email.com', 'superRealPassword')        
        page.getLoginButton().getAttribute('ng-reflect-disabled').then(isDisabled => expect(isDisabled[0]).toBe('false'))
    })

    it('should disable login button after failing to log in', () => {
        enterEmailPasswordAndCaptcha('test-user@fake-email.com', 'superRealPassword')  
        page.getLoginButton().click();     
        page.getLoginButton().getAttribute('ng-reflect-disabled').then(isDisabled => expect(isDisabled[0]).toBe('true'))
    })

    // upon successful login, check via:
    //page.getCurrentUrl().then(url => expect(url).toBe('http://localhost:4200/account')) 



});

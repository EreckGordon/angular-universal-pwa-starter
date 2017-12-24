import { browser, by, element } from 'protractor';

export class AppPage {
    navigateTo() {
        return browser.get('/');
    }

    getTopNav() {
        return element(by.xpath('/html/body/app-root/div/nav'));
    }
}

import { AppPage } from './app.po';

describe('Angular Universal PWA Starter App', () => {
    let page: AppPage;

    beforeEach(() => {
        page = new AppPage();
        page.navigateTo();
    });

    it('should have a top nav', () => {
        expect(page.getTopNav().getTagName()).toMatch('nav');
    });
});

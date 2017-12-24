import { AppPage } from './app.po';

describe('Angular Universal PWA Starter App', () => {
    let page: AppPage;

    beforeEach(() => {
        page = new AppPage();
    });

    it('should have a top nav', () => {
        page.navigateTo();
        expect(page.getTopNav().getTagName()).toMatch('nav');
    });
});

import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

interface TitleAndMetaTags {
    title: string;
    description: string;
    image?: string;
    type?: string;
    url: string;
    siteName?: string;
}

@Injectable()
export class SEOService {
    constructor(private meta: Meta, private title: Title) {}

    public setTitleAndMetaTags({
        title,
        description,
        image = 'https://avatars0.githubusercontent.com/u/20940462?s=400&u=0966a699f687a46e63a43d88236839c54af90a47&v=4',
        type = 'website',
        url,
        siteName = 'Angular Universal PWA Starter',
    }: TitleAndMetaTags): void {
        this.title.setTitle(title);
        this.meta.updateTag({ name: 'description', content: description }, 'name="description"');
        this.meta.updateTag({ itemprop: 'name', content: title }, 'itemprop="name"');
        this.meta.updateTag({ itemprop: 'description', content: description }, 'itemprop="description"');
        this.meta.updateTag({ itemprop: 'image', content: image }, 'itemprop="image"');
        this.meta.updateTag({ property: 'og:title', content: title }, 'property="og:title"');
        this.meta.updateTag({ property: 'og:type', content: type }, 'property="og:type"');
        this.meta.updateTag({ property: 'og:url', content: url }, 'property="og:url"');
        this.meta.updateTag({ property: 'og:image', content: image }, 'property="og:image"');
        this.meta.updateTag({ property: 'og:description', content: description }, 'property="og:description"');
        this.meta.updateTag({ property: 'og:site_name', content: siteName }, 'property="og:site_name"');
    }
}

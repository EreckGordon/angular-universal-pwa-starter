import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable()
export class SEOService {
    private author: Object;

    constructor(private meta: Meta, private title: Title) {
        this.author = { name: 'author', content: 'Ereck Gordon' };
    }

    public setPageTitle(pageTitle: string) {
        this.title.setTitle(pageTitle);
    }

    public setKeywordsAndDescription(keywords: string, description: string) {
        const keywordsObject = { name: 'keywords', content: keywords };
        const descriptionObject = { name: 'description', content: description };
        const tagsToCheck: any[] = [this.author, keywordsObject, descriptionObject];
        const unfilteredTags = this.meta.getTags('name');
        tagsToCheck.forEach(tag => {
            const filteredTag = unfilteredTags.filter(
                unfilteredTag => unfilteredTag.name === tag.name
            );
            filteredTag.length > 0 ? this.meta.updateTag(tag) : this.meta.addTag(tag);
        });
    }
}

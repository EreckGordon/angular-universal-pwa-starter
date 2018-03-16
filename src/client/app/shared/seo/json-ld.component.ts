import { Component, HostBinding, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'json-ld',
    template: '',
})
export class JsonLdComponent implements OnChanges {
    @Input() json;
    @HostBinding('innerHTML') jsonLD: SafeHtml;
    constructor(private sanitizer: DomSanitizer) {}

    ngOnChanges(changes: SimpleChanges) {
        this.jsonLD = this.getSafeHTML(changes.json.currentValue);
    }

    private getSafeHTML(value: {}) {
        const json = value ? JSON.stringify(value, null, 2).replace(/<\/script>/g, '<\\/script>') : '';
        const html = `<script type="application/ld+json">${json}</script>`;
        return this.sanitizer.bypassSecurityTrustHtml(html);
    }
}

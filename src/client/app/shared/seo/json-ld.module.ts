import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JsonLdComponent } from './json-ld.component';

@NgModule({
    imports: [CommonModule],
    declarations: [JsonLdComponent],
    exports: [JsonLdComponent],
})
export class JsonLdModule {}

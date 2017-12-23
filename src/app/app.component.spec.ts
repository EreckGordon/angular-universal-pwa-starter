import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppComponent } from './app.component';
import { CustomMaterialModule } from './shared/custom-material-module';

import { ServiceWorkerModule } from '@angular/service-worker';
import { NGSWUpdateService } from './shared/ngsw-update.service';

describe('AppComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                CustomMaterialModule,
                ServiceWorkerModule.register('', { enabled: false })
            ],
            declarations: [
                AppComponent
            ],
            providers: [
                NGSWUpdateService
            ]
        }).compileComponents();
    }));

    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));

});

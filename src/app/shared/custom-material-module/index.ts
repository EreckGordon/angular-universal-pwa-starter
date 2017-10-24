import { NgModule } from '@angular/core';
import {
  MdButtonModule,
  MdButtonToggleModule,
  MdCardModule,
  MdCheckboxModule,
  MdDialogModule,
  MdIconModule,
  MdInputModule,
  MdListModule,
  MdMenuModule,
  MdProgressBarModule,
  MdRadioModule,
  MdRippleModule,
  MdSelectModule,
  MdSidenavModule,
  MdSnackBarModule,
  MdTabsModule,
  MdToolbarModule,
  MdTooltipModule,
  StyleModule,
  MdCommonModule
} from '@angular/material';

import { BidiModule } from '@angular/cdk/bidi';
import { PortalModule } from '@angular/cdk/portal';
import { A11yModule }from '@angular/cdk/a11y';
import { PlatformModule }from '@angular/cdk/platform';
import { OverlayModule } from '@angular/cdk/overlay';

const MaterialModules = [
  MdButtonModule,
  MdButtonToggleModule,
  MdCardModule,
  MdCheckboxModule,
  MdDialogModule,
  MdIconModule,
  MdInputModule,
  MdListModule,
  MdMenuModule,
  MdProgressBarModule,
  MdRadioModule,
  MdRippleModule,
  MdSelectModule,
  MdSidenavModule,
  MdSnackBarModule,
  MdTabsModule,
  MdToolbarModule,
  MdTooltipModule,
  OverlayModule,
  PortalModule,
  BidiModule,
  StyleModule,
  A11yModule,
  PlatformModule,
  MdCommonModule
  ]

@NgModule({
  imports: [MaterialModules],
  exports: [MaterialModules],
})
export class CustomMaterialModule { }
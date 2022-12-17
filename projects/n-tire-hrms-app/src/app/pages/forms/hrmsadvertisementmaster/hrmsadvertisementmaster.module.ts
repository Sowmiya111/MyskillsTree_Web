import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgCommonModule } from '../../../../../../n-tire-bo-app/src/app/appcommon.module';
import { boreportviewerModule } from '../../../../../../n-tire-bo-app/src/app/pages/forms/boreportviewer/boreportviewer.module';
import { routing } from './hrmsadvertisementmaster.routing';
import { hrmsadvertisementmasterComponent } from './hrmsadvertisementmaster.component';
import { hrmsadvertisementdetailComponent } from './hrmsadvertisementdetail.component';


@NgModule({
  exports: [
    NgCommonModule
  ],
  imports: [boreportviewerModule,
    routing,
    NgCommonModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [hrmsadvertisementmasterComponent, hrmsadvertisementdetailComponent],
  entryComponents: [hrmsadvertisementdetailComponent]
})
export class hrmsadvertisementmasterModule { }

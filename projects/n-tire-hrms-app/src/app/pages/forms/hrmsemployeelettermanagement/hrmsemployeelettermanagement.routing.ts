import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { hrmsemployeelettermanagementComponent } from './hrmsemployeelettermanagement.component';
import { CanDeactivateGuard } from '../../../../../../n-tire-bo-app/src/app/pages/common/unsaved-changes';
const routes: Routes = [
  {
    path: 'hrmsemployeelettermanagements', children: [
      { path: '', component: hrmsemployeelettermanagementComponent, canDeactivate: [CanDeactivateGuard] },
      { path: 'edit/:id', component: hrmsemployeelettermanagementComponent, canDeactivate: [CanDeactivateGuard] }
    ]
  }
];

export const routing: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);

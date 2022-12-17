import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { boteamComponent } from './boteam.component';
import { CanDeactivateGuard } from '../../../../../../n-tire-bo-app/src/app/pages/common/unsaved-changes';
const routes: Routes = [
  {
    path: 'boteams', children: [
      { path: '', component: boteamComponent, canDeactivate: [CanDeactivateGuard] },
      { path: 'view/:id', component: boteamComponent, canDeactivate: [CanDeactivateGuard] },
      { path: 'edit/:id', component: boteamComponent, canDeactivate: [CanDeactivateGuard] }
    ]
  }
];

export const routing: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);

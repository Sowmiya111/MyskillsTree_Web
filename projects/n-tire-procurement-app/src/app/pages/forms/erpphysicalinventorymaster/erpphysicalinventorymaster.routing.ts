import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { erpphysicalinventorymasterComponent } from './erpphysicalinventorymaster.component';
import { CanDeactivateGuard } from '../../../../../../n-tire-bo-app/src/app/pages/common/unsaved-changes';
const routes: Routes = [
  {
    path: 'erpphysicalinventorymasters', children: [
      { path: '', component: erpphysicalinventorymasterComponent, canDeactivate: [CanDeactivateGuard] },
      { path: 'edit/:id', component: erpphysicalinventorymasterComponent, canDeactivate: [CanDeactivateGuard] }
    ]
  }
];

export const routing: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);

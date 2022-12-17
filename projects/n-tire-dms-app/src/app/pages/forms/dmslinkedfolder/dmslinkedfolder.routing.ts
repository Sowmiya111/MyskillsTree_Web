import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { dmslinkedfolderComponent } from './dmslinkedfolder.component';
import { CanDeactivateGuard } from '../../../../../../n-tire-bo-app/src/app/pages/common/unsaved-changes';
const routes: Routes = [
{
                        path: 'dmslinkedfolders',children: [
{ path: '', component: dmslinkedfolderComponent, canDeactivate: [CanDeactivateGuard] },
{ path: 'edit/:id', component: dmslinkedfolderComponent, canDeactivate: [CanDeactivateGuard] }
]} 
];
export const routing: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);

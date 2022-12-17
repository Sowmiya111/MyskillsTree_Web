import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { lmscorporatesecondarycontactComponent } from './lmscorporatesecondarycontact.component';
import { CanDeactivateGuard } from '../../../../../../n-tire-biz-app/src/app/pages/common/unsaved-changes';
const routes: Routes = [
    {
        path: 'lmscorporatesecondarycontacts', children: [
            { path: '', component: lmscorporatesecondarycontactComponent, canDeactivate: [CanDeactivateGuard] },
            { path: 'edit/:id', component: lmscorporatesecondarycontactComponent, canDeactivate: [CanDeactivateGuard] },
            { path: 'view/:viewid', component: lmscorporatesecondarycontactComponent, canDeactivate: [CanDeactivateGuard] },
            { path: 'edit/:id/source/:sourcekey/:sourceid', component: lmscorporatesecondarycontactComponent, canDeactivate: [CanDeactivateGuard] }
        ]
    }
];
export const routing: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);

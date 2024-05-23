import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { NotfoundComponent } from './api/components/notfound/notfound.component';
import { AuthGuard } from './api/guards/auth/auth.guard';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppLayoutComponent,
                // canActivate: [AuthGuard],

                children: [
                    { path: '', loadChildren: () => import('./api/components/dashboard/dashboard.module').then(m => m.DashboardModule) },
                    { path: 'panel', loadChildren: () => import('./api/components/panel/panel.module').then(m => m.PanelModule) },
                ]
            },
            { path: 'auth', loadChildren: () => import('./api/components/auth/auth.module').then(m => m.AuthModule) },
            { path: 'landing', loadChildren: () => import('./api/components/landing/landing.module').then(m => m.LandingModule) },
            { path: 'notfound', component: NotfoundComponent },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}

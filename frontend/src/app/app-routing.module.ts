import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboadRoutingModule } from './modules/dashboard/dashboard-routing.module';
import { VideoComponent } from './modules/video/video/video.component';
import { SingupComponent } from './modules/user/components/singup/singup.component';
import { LoginComponent } from './modules/user/components/login/login.component';
import { NotFoundComponent } from './modules/dashboard/pages/not-found/not-found/not-found.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/dashboard' },
  { path: 'singup', component: SingupComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { enableTracing: false, useHash: false }),
    DashboadRoutingModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

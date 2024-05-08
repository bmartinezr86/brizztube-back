import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboadRoutingModule } from './modules/dashboard/dashboard-routing.module';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/dashboard' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { enableTracing: false, useHash: false }),
    DashboadRoutingModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Parte2Component } from './parte2.component';

const routes: Routes = [
  {
    path: '',
    component: Parte2Component,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Parte2RoutingModule {}

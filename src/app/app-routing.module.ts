import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { Rotas } from './core/enums';

const routes: Routes = [
  {
    path: Rotas.INICIO,
    loadChildren: () =>
      import('./pages/inicio/inicio.module').then((m) => m.InicioModule),
  },
  {
    path: Rotas.PARTE1,
    loadChildren: () =>
      import('./pages/parte1/parte1.module').then((m) => m.Parte1Module),
  },
  {
    path: '**',
    redirectTo: Rotas.INICIO,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [BrowserModule, RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}

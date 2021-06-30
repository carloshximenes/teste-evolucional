import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ROTAS } from './core/enums';
import { InicioComponent } from './pages/inicio/inicio.component';

const routes: Routes = [
  { path: ROTAS.inicio, component: InicioComponent },
  { path: '', redirectTo: ROTAS.inicio, pathMatch: 'full' },
];

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

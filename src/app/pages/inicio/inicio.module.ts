import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { InicioRoutingModule } from './inicio-routing.module';
import { InicioComponent } from './inicio.component';

@NgModule({
  declarations: [InicioComponent],
  imports: [CommonModule, InicioRoutingModule],
})
export class InicioModule {}

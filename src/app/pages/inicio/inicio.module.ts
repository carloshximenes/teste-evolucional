import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { InicioRoutingModule } from './inicio-routing.module';
import { InicioComponent } from './inicio.component';

@NgModule({
  declarations: [InicioComponent],
  imports: [CommonModule, InicioRoutingModule, CardModule, ToastModule],
  providers: [MessageService],
})
export class InicioModule {}

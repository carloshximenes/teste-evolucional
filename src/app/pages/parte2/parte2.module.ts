import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { Parte2RoutingModule } from './parte2-routing.module';
import { Parte2Component } from './parte2.component';
import { Parte2Service } from './parte2.service';

@NgModule({
  declarations: [Parte2Component],
  imports: [
    CommonModule,
    HttpClientModule,
    Parte2RoutingModule,
    ReactiveFormsModule,
    CardModule,
    DropdownModule,
    ButtonModule,
    TableModule,
    ChartsModule,
    DialogModule,
    InputTextModule,
    ToastModule,
  ],
  providers: [Parte2Service, MessageService],
})
export class Parte2Module {}

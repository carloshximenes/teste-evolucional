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
import { Parte1RoutingModule } from './parte1-routing.module';
import { Parte1Component } from './parte1.component';
import { Parte1Service } from './parte1.service';

@NgModule({
  declarations: [Parte1Component],
  imports: [
    CommonModule,
    HttpClientModule,
    Parte1RoutingModule,
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
  providers: [Parte1Service, MessageService],
})
export class Parte1Module {}

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { Parte1RoutingModule } from './parte1-routing.module';
import { Parte1Component } from './parte1.component';
import { Parte1Service } from './parte1.service';

@NgModule({
  declarations: [Parte1Component],
  imports: [
    CommonModule,
    Parte1RoutingModule,
    ReactiveFormsModule,
    CardModule,
    DropdownModule,
    ButtonModule,
    TableModule,
  ],
  providers: [Parte1Service],
})
export class Parte1Module {}

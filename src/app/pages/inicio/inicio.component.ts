import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Rotas } from 'src/app/core/enums';
import { StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
})
export class InicioComponent implements OnInit {
  constructor(
    private router: Router,
    private storageService: StorageService,
    private messageService: MessageService
  ) {}

  get Rotas() {
    return Rotas;
  }

  ngOnInit(): void {}

  public navegar(rota: string): void {
    this.router.navigate([rota]);
  }

  public limparTabelas(): void {
    this.storageService.deletarObjeto('students');
    this.storageService.deletarObjeto('relationships');
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'As tabelas STUDENTS e RELATIONSHIPS foram resetadas',
    });
  }
}

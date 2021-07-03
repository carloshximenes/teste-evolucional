import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { take } from 'rxjs/operators';
import {
  Classe,
  Degree,
  Matter,
  Relationship,
  Teacher,
} from 'src/app/core/entities';
import { Parte2Service } from './parte2.service';

@Component({
  selector: 'app-parte2',
  templateUrl: './parte2.component.html',
  styleUrls: ['./parte2.component.scss'],
})
export class Parte2Component implements OnInit {
  public formulario: FormGroup;
  public formularioProfessor: FormGroup;

  public lista: Array<Relationship> = [];
  public listaProfessor: Array<Teacher>;
  public listaSerie: Array<Degree>;
  public listaClasse: Array<Classe>;
  public listaMateria: Array<Matter>;

  public first: number = 0;
  public rows: number = 5;
  public totalRegistros: number = 0;

  public exibirModalNovoRelacionamento: boolean = false;

  constructor(
    private service: Parte2Service,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.inicializarObjetos();
    this.criarFormulario();
    this.criarFormularioProfessor();
  }

  private inicializarObjetos(): void {
    this.service
      .getListaProfessor()
      .pipe(take(1))
      .subscribe((res) => (this.listaProfessor = res));
    this.service
      .getListaSerie()
      .pipe(take(1))
      .subscribe((res) => (this.listaSerie = res));
    this.service
      .getListaClasse()
      .pipe(take(1))
      .subscribe((res) => (this.listaClasse = res['classes']));
    this.service
      .getListaMateria()
      .pipe(take(1))
      .subscribe((res) => (this.listaMateria = res));
  }

  private criarFormulario(): void {
    this.formulario = this.formBuilder.group({
      classe: [null],
      serie: [null],
    });
  }

  private criarFormularioProfessor(): void {
    this.formularioProfessor = this.formBuilder.group({
      professor: [null, Validators.required],
      serie: [null, Validators.required],
      classe: [null, Validators.required],
      materia: [null, Validators.required],
    });
  }

  public limpar(): void {
    this.formulario.reset();
    this.lista = [];
  }

  public pesquisar(event: LazyLoadEvent = null): void {
    const { classe, serie } = this.formulario.getRawValue();
    this.service
      .getLista()
      .pipe(take(1))
      .subscribe((res) => {
        if (classe != null) {
          res = res.filter((p) => p.class.id == classe.id);
        }
        if (serie != null) {
          res = res.filter((p) => p.degree.id == serie.id);
        }
        this.first = event ? event.first : 0;
        if (res.length == 0) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Atenção',
            detail:
              'Não encontramos nenhum estudante com os parâmetros informados',
          });
          return;
        }
        this.totalRegistros = res.length;
        this.lista = res.slice(this.first, this.first + this.rows);
        this.totalRegistros = res.length;
      });
  }

  public novoRelacionamento(): void {
    this.formularioProfessor.reset();
    this.exibirModalNovoRelacionamento = true;
  }

  public salvarNovoRelacionamento(): void {
    if (this.formularioProfessor.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Favor preencher todos os campos obrigatórios',
      });
      return;
    }
    this.service
      .salvarNovoRelacionamento(this.formularioProfessor.getRawValue())
      .pipe(take(1))
      .subscribe((res) => {
        if (!res) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Atenção',
            detail:
              'O professor informado já ministra esta matéria para a série e turma informada',
          });
          return;
        }
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Novo relacionamento criado com sucesso',
        });
        this.exibirModalNovoRelacionamento = false;
        const event = {
          first: this.first,
        };
        this.pesquisar(event);
      });
  }
}

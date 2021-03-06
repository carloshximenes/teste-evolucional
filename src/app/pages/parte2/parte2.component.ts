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
  Student,
  Teacher,
} from 'src/app/core/entities';
import { Rotas } from 'src/app/core/enums';
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
  public listaAlunos: Array<Student>;

  public first: number = 0;
  public rows: number = 5;
  public totalRegistros: number = 0;

  public exibirModalNovoRelacionamento: boolean = false;
  public exibirModalAlunos: boolean = false;

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
        if (serie != null) {
          res = res.filter((p) => p.degree.id == serie.id);
        }
        if (classe != null) {
          res = res.filter((p) => {
            const classeExiste = p.class.find(c => c.id == classe.id);         
            return classeExiste != null;
          });
        }
        this.first = event ? event.first : 0;
        if (res.length == 0) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Aten????o',
            detail:
              'N??o encontramos nenhum estudante com os par??metros informados',
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
        summary: 'Aten????o',
        detail: 'Favor preencher todos os campos obrigat??rios',
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
            summary: 'Aten????o',
            detail:
              'O professor informado j?? ministra esta mat??ria para a s??rie e turma informada',
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

  public voltarTelaInicio(): void {
    this.router.navigate([Rotas.INICIO]);
  }

  public buscarAlunosMatriculados(relacionamento: Relationship): void {
    this.listaAlunos = [];
    this.service
      .getListaAluno()
      .pipe(take(1))
      .subscribe((res) => {
        if (relacionamento.degree != null) {
          res = res.filter((a) => a.degreeId == relacionamento.degree.id);
        }
        if (res.length == 0) {
          this.messageService.add({
            severity: 'warn',
            summary: 'Aten????o',
            detail: 'N??o existem alunos matriculados para essa turma',
          });
          return;
        }
        this.listaAlunos = res;
        this.exibirModalAlunos = true;
      });
  }

  public getDescricaoClasse(classe: number): string {
    const classeSelecionada = this.listaClasse.find((s) => s.id == classe);
    return classeSelecionada ? classeSelecionada.name : 'N??o Informada';
  }

  public exibirClasses(classes: Classe[]): string {
    return classes.map((c) => c.name).join(' | ');
  }
}

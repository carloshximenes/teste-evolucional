import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { take } from 'rxjs/operators';
import { Classe, Degree, Student } from 'src/app/core/entities';
import { ClasseEnum } from 'src/app/core/enums';
import { Parte1Service } from './parte1.service';

@Component({
  selector: 'app-parte1',
  templateUrl: './parte1.component.html',
  styleUrls: ['./parte1.component.scss'],
})
export class Parte1Component implements OnInit {
  constructor(
    private service: Parte1Service,
    private formBuilder: FormBuilder,
    private messageService: MessageService
  ) {}

  public formulario: FormGroup;
  public formularioEstudante: FormGroup;

  public listaAlunos: Array<Student> = [];
  public listaSerie: Array<Degree>;
  public listaClasse: Array<Classe>;

  public first: number = 0;
  public rows: number = 5;
  public totalRegistros: number = 0;

  public exibirModalAtualizarEstudante: boolean = false;

  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [{}],
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      },
    },
  };
  public barChartLabels: Label[] = ['ALUNOS x SÉRIE'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;

  public barChartData: ChartDataSets[] = [
    { data: [0], label: 'A' },
    { data: [1], label: 'B' },
    { data: [2], label: 'C' },
    { data: [3], label: 'D' },
    { data: [4], label: 'E' },
    { data: [5], label: 'F' },
  ];

  ngOnInit(): void {
    this.criarFormulario();
    this.criarFormularioEditarEstudante();
    this.inicializarObjetos();
  }

  private inicializarObjetos(): void {
    this.service.limparListaAluno();
    this.service
      .getListaSerie()
      .pipe(take(1))
      .subscribe((res) => (this.listaSerie = res));
    this.service
      .getListaClasse()
      .pipe(take(1))
      .subscribe((res) => (this.listaClasse = res['classes']));
  }

  private criarFormulario(): void {
    this.formulario = this.formBuilder.group({
      classe: [null],
      serie: [null],
    });
  }

  private criarFormularioEditarEstudante(): void {
    this.formularioEstudante = this.formBuilder.group({
      id: [null, Validators.required],
      name: [null, Validators.required],
      classe: [null, Validators.required],
    });
  }

  public pesquisar(event: LazyLoadEvent = null): void {
    const { classe, serie } = this.formulario.getRawValue();
    this.service
      .getListaAluno()
      .pipe(take(1))
      .subscribe((res) => {
        if (classe != null) {
          res = res.filter((a) => a.classId == classe.id);
        }
        if (serie != null) {
          res = res.filter((a) => a.degreeId == serie.id);
        }
        this.first = event ? event.first : 0;
        if(res.length == 0) {
          this.messageService.add({severity:'warn', summary: 'Atenção', detail: 'Não encontramos nenhum estudante com os parâmetros informados'});
          return;
        }
        this.totalRegistros = res.length;
        this.listaAlunos = res.slice(this.first, this.first + this.rows);
        this.calcularValoresGrafico(res);
      });
  }

  public limpar(): void {
    this.formulario.reset();
    this.listaAlunos = [];
  }

  public gerarNovosRegistros(): void {
    this.service
      .gerarNovosRegistros(300)
      .pipe(take(1))
      .subscribe((novaLista) => {
        this.listaAlunos = novaLista;
        this.messageService.add({severity:'success', summary: 'Sucesso', detail: 'Foram gerados 300 novos estudantes aleatoriamente'});
      });
    const event = {
      first: this.first,
    };
    this.pesquisar(event);
  }

  private calcularValoresGrafico(alunos: Student[]): void {
    this.barChartData[0].data = [
      [...alunos].filter((res) => res.classId == ClasseEnum.A).length,
    ];
    this.barChartData[1].data = [
      [...alunos].filter((res) => res.classId == ClasseEnum.B).length,
    ];
    this.barChartData[2].data = [
      [...alunos].filter((res) => res.classId == ClasseEnum.C).length,
    ];
    this.barChartData[3].data = [
      [...alunos].filter((res) => res.classId == ClasseEnum.D).length,
    ];
    this.barChartData[4].data = [
      [...alunos].filter((res) => res.classId == ClasseEnum.E).length,
    ];
    this.barChartData[5].data = [
      [...alunos].filter((res) => res.classId == ClasseEnum.F).length,
    ];
  }

  public getDescricaoSerie(serie: number): string {
    const serieSelecionada = this.listaSerie.find((s) => s.id == serie);
    return serieSelecionada ? serieSelecionada.name : 'Não Informada';
  }

  public getDescricaoClasse(classe: number): string {
    const classeSelecionada = this.listaClasse.find((s) => s.id == classe);
    return classeSelecionada ? classeSelecionada.name : 'Não Informada';
  }

  public editarEstudante(estudante: Student): void {
    this.formularioEstudante.reset();
    this.formularioEstudante.patchValue(estudante);

    const classeSelecionada = this.listaClasse.find(
      (c) => c.id == estudante.classId
    );
    this.formularioEstudante.get('classe').patchValue(classeSelecionada);
    this.exibirModalAtualizarEstudante = true;
  }

  public salvarEstudante(): void {
    if (this.formularioEstudante.invalid) {
      this.messageService.add({severity:'warn', summary: 'Atenção', detail: 'Favor preencher todos os campos obrigatórios'});
      return;
    }

    this.service
      .salvarEstudante(this.formularioEstudante.value)
      .pipe(take(1))
      .subscribe((res) => {
        if (!res) {
          this.messageService.add({severity:'error', summary: 'Erro', detail: 'Não foi possível atualizar os dados do estudante'});
          return;
        }
        this.exibirModalAtualizarEstudante = false;
        const event = {
          first: this.first,
        };
        this.messageService.add({severity:'success', summary: 'Sucesso', detail: 'Os dados do estudante foram atualizados com sucesso'});
        this.pesquisar(event);
      });
  }
}

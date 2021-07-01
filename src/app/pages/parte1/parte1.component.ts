import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { LazyLoadEvent } from 'primeng/api';
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
    private formBuilder: FormBuilder
  ) {}

  public formulario: FormGroup;

  public listaAlunos: Array<Student> = [];
  public listaSerie: Array<Degree>;
  public listaClasse: Array<Classe>;

  public first: number = 0;
  public rows: number = 5;
  public totalRegistros: number;

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

  public pesquisar(): void {
    const event = {
      first: 0,
      rows: this.rows,
    };
    this.pesquisarPorFiltro(event);
  }

  public pesquisarPorFiltro(event: LazyLoadEvent): void {
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
        this.first = event.first;
        this.listaAlunos = res.slice(event.first, event.first + event.rows);

        this.totalRegistros = res.length;
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
      });
    const event = {
      first: this.first,
      rows: this.rows,
    };
    this.pesquisarPorFiltro(event);
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
}

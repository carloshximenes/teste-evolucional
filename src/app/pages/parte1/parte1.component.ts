import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Classe, Degree, Student } from 'src/app/core/entities';
import { JsonService } from 'src/app/core/services/json.service';
import { Parte1Service } from './parte1.service';

@Component({
  selector: 'app-parte1',
  templateUrl: './parte1.component.html',
  styleUrls: ['./parte1.component.scss'],
})
export class Parte1Component implements OnInit {
  constructor(
    private jsonService: JsonService,
    private service: Parte1Service,
    private formBuilder: FormBuilder
  ) {}

  public formulario: FormGroup;

  public listaAlunos: Array<Student> = [];
  public listaSerie: Array<Degree> = this.jsonService.getListaSerie();
  public listaClasse: Array<Classe> = this.jsonService.getListaClasse();

  ngOnInit(): void {
    this.criarFormulario();
  }

  private criarFormulario(): void {
    this.formulario = this.formBuilder.group({
      classe: [null],
      serie: [null],
    });
  }

  public pesquisar(): void {
    const { classe, serie } = this.formulario.getRawValue();
    this.listaAlunos = this.service.getAlunosBy(serie, classe);
  }

  public limpar(): void {
    this.formulario.reset();
    this.listaAlunos = [];
  }

  public gerarNovosRegistros(): void {
    this.jsonService.gerarNovosRegistros(300);
    this.pesquisar();
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

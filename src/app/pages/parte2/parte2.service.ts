import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ClasseDto } from 'src/app/core/dto/classe.dto';
import { DegreesDto } from 'src/app/core/dto/degrees.dto';
import { RelationshipDto } from 'src/app/core/dto/relationship.dto';
import {
  Classe,
  Degree,
  Matter,
  Relationship,
  Student,
  Teacher,
} from 'src/app/core/entities';
import { StorageService } from 'src/app/core/services/storage.service';
import classes from 'src/assets/classes.json';
import degrees from 'src/assets/degrees.json';
import matters from 'src/assets/matters.json';
import relationships from 'src/assets/relationships.json';
import teachers from 'src/assets/teachers.json';
import { Parte1Service } from '../parte1/parte1.service';

@Injectable({
  providedIn: 'root',
})
export class Parte2Service {
  constructor(
    private storageService: StorageService,
    private alunoService: Parte1Service
  ) {}

  public getListaSerie(): Observable<Degree[]> {
    return of(degrees);
  }

  public getListaClasse(): Observable<Classe[]> {
    return of(classes);
  }

  public getListaMateria(): Observable<Matter[]> {
    return of(matters);
  }

  private gerarListaProfessor(): void {
    if (this.storageService.getObjeto('teachers') == null) {
      this.updateListaProfessor(JSON.stringify(teachers));
    }
  }

  public getListaProfessor(): Observable<Teacher[]> {
    this.gerarListaProfessor();
    return of(JSON.parse(this.storageService.getObjeto('teachers')));
  }

  public getLista(): Observable<Relationship[]> {
    if (this.storageService.getObjeto('relationships') == null) {
      this.updateListaRelacionamento(JSON.stringify(relationships));
    }

    const listaOrdenada = this.gerarRelacionamentos().sort(
      (a, b) =>
        a.teacher.id - b.teacher.id ||
        a.matter.id - b.matter.id ||
        a.degree.id - b.degree.id
    );
    return of(listaOrdenada);
  }

  private gerarRelacionamentos(): Relationship[] {
    this.gerarListaProfessor();
    const lista: Relationship[] = [];
    const listaProfessor = JSON.parse(
      this.storageService.getObjeto('teachers')
    );
    const listaClasse = classes['classes'];
    const listaSerie = degrees;
    const listaMaterias = matters;
    const listaRelacionamentos = JSON.parse(
      this.storageService.getObjeto('relationships')
    );

    listaRelacionamentos.map((dto: RelationshipDto) => {
      const professor = new Teacher({
        id: dto.teacherId,
        name: listaProfessor.find((p) => p.id == dto.teacherId)['name'],
      });
      const materia = new Matter({
        id: dto.matterId,
        name: listaMaterias.find((m) => m.id == dto.matterId)['name'],
      });

      dto.degrees.map((d) => {
        const serie = new Degree({
          id: d.degreeId,
          name: listaSerie.find((s) => s.id == d.degreeId)['name'],
        });

        const classes = [];
        d.classes.map((c) => {
          const classe = new Classe({
            id: c.classId,
            name: listaClasse.find((cl) => cl.id == c.classId)['name'],
          });
          classes.push(classe);
        });

        const novoRelacionamento = new Relationship({
          id: dto.id,
          teacher: professor,
          matter: materia,
          degree: serie,
          class: classes.sort((a, b) => a.id - b.id),
        });
        lista.push(novoRelacionamento);
      });
    });

    return lista;
  }

  private updateListaProfessor(lista: any): void {
    this.storageService.salvarObjeto('teachers', lista);
  }

  private updateListaRelacionamento(lista: any): void {
    this.storageService.salvarObjeto('relationships', lista);
  }

  public salvarNovoRelacionamento(
    novoRelacionamento: any
  ): Observable<boolean> {
    const { professor, materia, serie, classe } = novoRelacionamento;
    let novaLista = [];

    const listaRelacionamentos = JSON.parse(
      this.storageService.getObjeto('relationships')
    );

    const detalhesProfessor = listaRelacionamentos.filter(
      (r) => r.teacherId == professor.id
    );

    const detalhesMateria = detalhesProfessor.find(
      (p) => p.matterId == materia.id
    );

    if (detalhesMateria == null) {
      const novaMateria = this.adicionarNovaMateria(
        detalhesProfessor[0],
        novoRelacionamento
      );
      novaLista = [...listaRelacionamentos, novaMateria];
    } else {
      const detalhesSerie = detalhesMateria.degrees.find(
        (m) => m.degreeId == serie.id
      );
      if (detalhesSerie == null) {
        const novaSerie = this.adicionarNovaSerie(
          detalhesMateria,
          novoRelacionamento
        );
        novaLista = [...listaRelacionamentos, novaSerie];
      } else {
        const detalhesClasse = detalhesSerie.classes.find(
          (s) => s.classId == classe.id
        );
        if (detalhesClasse == null) {
          this.adicionarNovaClasse(
            detalhesMateria,
            detalhesSerie.degreeId,
            novoRelacionamento
          );
          novaLista = [...listaRelacionamentos];
        } else {
          return of(false);
        }
      }
    }

    this.updateListaRelacionamento(JSON.stringify(novaLista));
    return of(true);
  }

  private adicionarNovaMateria(
    objeto: any,
    novoRelacionamento: any
  ): RelationshipDto {
    const { materia, serie, classe } = novoRelacionamento;
    const { id, teacherId } = objeto;

    const novaClasse = new ClasseDto();
    novaClasse.classId = classe.id;

    const novaSerie = new DegreesDto();
    novaSerie.degreeId = serie.id;
    novaSerie.classes = [novaClasse];

    const relacionamentoDto = new RelationshipDto();
    relacionamentoDto.id = id;
    relacionamentoDto.teacherId = teacherId;
    relacionamentoDto.matterId = materia.id;
    relacionamentoDto.degrees = [novaSerie];

    return relacionamentoDto;
  }

  private adicionarNovaSerie(
    objeto: any,
    novoRelacionamento: any
  ): RelationshipDto {
    const { serie, classe } = novoRelacionamento;
    const { id, teacherId, matterId } = objeto;

    const novaClasse = new ClasseDto();
    novaClasse.classId = classe.id;

    const novaSerie = new DegreesDto();
    novaSerie.degreeId = serie.id;
    novaSerie.classes = [novaClasse];

    const relacionamentoDto = new RelationshipDto();
    relacionamentoDto.id = id;
    relacionamentoDto.teacherId = teacherId;
    relacionamentoDto.matterId = matterId;
    relacionamentoDto.degrees = [novaSerie];

    return relacionamentoDto;
  }

  private adicionarNovaClasse(
    objeto: any,
    serieId: number,
    novoRelacionamento: any
  ): void {
    const { serie, classe } = novoRelacionamento;
    const { id, teacherId, degrees } = objeto;

    const classesAtuais = degrees.find((d) => d.degreeId == serieId).classes;
    const novaClasse = new ClasseDto();
    novaClasse.classId = classe.id;
    classesAtuais.push(novaClasse);

    const relacionamentoDto = new RelationshipDto();
    relacionamentoDto.id = id;
    relacionamentoDto.teacherId = teacherId;
    relacionamentoDto.matterId = serie.id;
    relacionamentoDto.degrees = [...degrees];
  }

  public getListaAluno(): Observable<Student[]> {
    return this.alunoService.getListaAluno();
  }
}

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
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
      this.gerarRelacionamentos();
    }

    const listaOrdenada = JSON.parse(
      this.storageService.getObjeto('relationships')
    ).sort(
      (a, b) =>
        a.teacher.id - b.teacher.id ||
        a.matter.id - b.matter.id ||
        a.degree.id - b.degree.id ||
        a.class.id - b.class.id
    );
    return of(listaOrdenada);
  }

  private gerarRelacionamentos(): void {
    this.gerarListaProfessor();
    const lista: Relationship[] = [];
    const listProfessor = JSON.parse(this.storageService.getObjeto('teachers'));
    const listaClasse = classes['classes'];
    const listaSerie = degrees;
    const listaMaterias = matters;

    relationships.map((dto: RelationshipDto) => {
      const professor = new Teacher({
        id: dto.teacherId,
        name: listProfessor.find((p) => p.id == dto.teacherId)['name'],
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

        d.classes.map((c) => {
          const classe = new Classe({
            id: c.classId,
            name: listaClasse.find((cl) => cl.id == c.classId)['name'],
          });
          const novoRelacionamento = new Relationship({
            id: dto.id,
            teacher: professor,
            matter: materia,
            degree: serie,
            class: classe,
          });
          lista.push(novoRelacionamento);
        });
      });
    });

    this.updateListaRelacionamento(JSON.stringify(lista));
  }

  private updateListaProfessor(lista: any): void {
    this.storageService.salvarObjeto('teachers', lista);
  }

  private updateListaRelacionamento(lista: any): void {
    this.storageService.salvarObjeto('relationships', lista);
  }

  public salvarNovoRelacionamento(objeto: any): Observable<boolean> {
    if (this.relacionamentoJahExiste(objeto)) {
      return of(false);
    }
    const listaRelacionamentos = JSON.parse(
      this.storageService.getObjeto('relationships')
    );
    const novoRelacionamento = new Relationship({
      teacher: objeto.professor,
      degree: objeto.serie,
      matter: objeto.materia,
      class: objeto.classe,
    });
    listaRelacionamentos.push(novoRelacionamento);
    this.updateListaRelacionamento(JSON.stringify(listaRelacionamentos));
    return of(true);
  }

  private relacionamentoJahExiste(objeto: any): boolean {
    const { professor, materia, serie, classe } = objeto;

    const detalhesProfessor = relationships.filter(
      (r) => r.teacherId == professor.id
    );
    if (detalhesProfessor.length == 0) {
      return false;
    }

    const detalhesMateria = detalhesProfessor.map((p) => {
      if (p.matterId == materia.id) {
        return p.degrees;
      }
    });

    if (detalhesMateria.length == 0) {
      return false;
    }

    const detalhesSerie = detalhesMateria[0].map((m) => {
      if (m.degreeId == serie.id) {
        return m.classes;
      }
    });

    if (detalhesSerie.length == 0) {
      return false;
    }

    const detalhesClasse = detalhesSerie[0].find((s) => s.classId == classe.id);

    return detalhesClasse != null;
  }

  public getListaAluno(): Observable<Student[]> {
    return this.alunoService.getListaAluno();
  }
}

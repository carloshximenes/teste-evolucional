import { Injectable } from '@angular/core';
import { Classe, Degree, Student } from 'src/app/core/entities';
import { JsonService } from 'src/app/core/services/json.service';

@Injectable({
  providedIn: 'root',
})
export class Parte1Service {
  constructor(private jsonService: JsonService) {}

  public getAlunosBy(serie: Degree, classe: Classe): Array<Student> {
    let listaAluno = this.jsonService.getListaAluno();
    if (serie != null) {
      listaAluno = listaAluno.filter((aluno) => aluno.degreeId == serie.id);
    }

    if (classe != null) {
      listaAluno = listaAluno.filter((aluno) => aluno.classId == classe.id);
    }

    return listaAluno;
  }
}

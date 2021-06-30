import { Injectable } from '@angular/core';
import { Classe, Degree, Student } from '../entities';
import classes from '../jsons/classes.json';
import degrees from '../jsons/degrees.json';
import students from '../jsons/students.json';

@Injectable({
  providedIn: 'root',
})
export class JsonService {
  constructor() {}

  public getListaClasse(): Array<Classe> {
    return classes['classes'];
  }

  public getListaSerie(): Array<Degree> {
    return degrees;
  }

  public getListaAluno(): Array<Student> {
    return students;
  }

  private getAlunoUltimoId(): number {
    const listaAlunoOrdenadaDesc = [...this.getListaAluno()].sort((a, b) =>
      a.id < b.id ? 1 : b.id < a.id ? -1 : 0
    );
    const ultimoRegistro = { ...listaAlunoOrdenadaDesc[0] };

    return ultimoRegistro.id;
  }

  private gerarNumeroAleatorio(limite: number): number {
    return Math.floor(Math.random() * limite) + 1;
  }

  public gerarNovosRegistros(quantidade: number): void {
    let proximoId = this.getAlunoUltimoId() + 1;
    for (let i = 0; i < quantidade; i++) {
      const novoEstudante = new Student({
        id: proximoId,
        ra: proximoId * 999,
        name: `Nome do aluno ${proximoId}`,
        classId: this.gerarNumeroAleatorio(this.getListaClasse().length),
        degreeId: this.gerarNumeroAleatorio(this.getListaSerie().length),
      });
      this.getListaAluno().push(novoEstudante);
      proximoId++;
    }
  }
}

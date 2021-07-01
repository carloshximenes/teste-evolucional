import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Classe, Degree, Student } from 'src/app/core/entities';
import { StorageService } from 'src/app/core/services/storage.service';
import classes from 'src/assets/classes.json';
import degrees from 'src/assets/degrees.json';
import students from 'src/assets/students.json';

@Injectable({
  providedIn: 'root',
})
export class Parte1Service {
  constructor(private storageService: StorageService) {}

  public getListaSerie(): Observable<Degree[]> {
    return of(degrees);
  }

  public getListaAluno(): Observable<Student[]> {
    if (this.storageService.getObjeto('students') == null) {
      this.updateListaAluno(JSON.stringify(students));
    }
    const lista = JSON.parse(this.storageService.getObjeto('students'));
    return of(lista);
  }

  public getListaClasse(): Observable<Classe[]> {
    return of(classes);
  }

  public limparListaAluno(): void {
    this.storageService.deletarObjeto('students');
  }

  private updateListaAluno(lista: any): void {
    this.storageService.salvarObjeto('students', lista);
  }

  private getAlunoUltimoId(lista: Student[]): number {
    const listaAlunoOrdenadaDesc = [...lista].sort((a, b) =>
      a.id < b.id ? 1 : b.id < a.id ? -1 : 0
    );
    const ultimoRegistro = { ...listaAlunoOrdenadaDesc[0] };

    return ultimoRegistro.id;
  }

  private gerarNumeroAleatorio(limite: number): number {
    return Math.floor(Math.random() * limite) + 1;
  }

  private gerarClasseAleatoria(): number {
    return this.gerarNumeroAleatorio(6);
  }

  private gerarSerieAleatoria(): number {
    return this.gerarNumeroAleatorio(13);
  }

  public gerarNovosRegistros(
    quantidade: number
  ): Observable<Student[]> {
    const lista = JSON.parse(this.storageService.getObjeto('students'));
    let proximoId = this.getAlunoUltimoId(lista) + 1;
    for (let i = 0; i < quantidade; i++) {
      const novoEstudante = {
        id: proximoId,
        ra: proximoId * 999,
        name: `Nome do aluno ${proximoId}`,
        classId: this.gerarClasseAleatoria(),
        degreeId: this.gerarSerieAleatoria(),
      };
      lista.push(novoEstudante);
      proximoId++;
    }

    this.updateListaAluno(JSON.stringify(lista));
    return of(lista);
  }
}

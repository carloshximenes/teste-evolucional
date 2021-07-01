import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  public salvarObjeto(nome: string, objeto: any): void {
    localStorage.setItem(nome, objeto);
  }

  public getObjeto(nome: string) {
    return localStorage.getItem(nome);
  }

  public deletarObjeto(nome: string) {
    localStorage.removeItem(nome);
  }
}

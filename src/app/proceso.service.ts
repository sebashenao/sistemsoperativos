import { Injectable } from '@angular/core';
import { Proceso } from './proceso';

@Injectable({
  providedIn: 'root'
})
export class ProcesoService {

  proceso = new Proceso()

  constructor() {}

  getProceso(): Proceso {
  	return this.proceso
  }
}

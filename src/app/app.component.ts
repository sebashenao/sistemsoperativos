import { Component } from '@angular/core';
declare var $: any
import { ProcesoService } from './proceso.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {

  constructor(public procesoService: ProcesoService) {

  }

  listProceso: any = []
  duracion: string
  tiempoq: string
  id: number = 1
  tiempoRetorno: number = 0
  tiempoEspera: number = 0
  promedioEspera: number = 0
  promedioRetorno: number = 0
  prioridadActiva : boolean = false
  tamLista: number = 0
  contadorPrioridad: number = 0
  listProcesoPrioridad: any = []
  tiempoProceso : number = 0
  frenarProceso: boolean = false

  ngOnInit() {
    $('.inputDuracion').keypress(function(tecla) {
      if (tecla.charCode < 48 || tecla.charCode > 57) return false
    });
    $('.roundRobin').hide()
  }

  pushProceso(valor: any, llenado: boolean) {

    if (valor != null && valor != undefined && valor != '') {

      valor = parseInt(valor);

      this.tiempoRetorno += valor

      let data = {
        id: this.id,
        duracion: valor,
        tiempoEspera: this.tiempoEspera,
        tiempoRetorno: this.tiempoRetorno,
      }

      if(llenado) {
        this.listProceso.push(data)
      }
      else {
        this.procesoService.getProceso().getListOriginal().push(data)
      }

      this.tiempoEspera += valor
      this.id++
      this.duracion = ''
    }
  }

  FCSF() {
    this.inhabilitarBotones()

    if (this.procesoService.getProceso().getListOriginal().length > 0) {
      for (var i of this.procesoService.getProceso().getListOriginal()) {
        this.procesoService.getProceso().setPromedioEspera(this.procesoService.getProceso().getPromedioEspera() + i.tiempoEspera)
        this.procesoService.getProceso().setPromedioRetorno(this.procesoService.getProceso().getPromedioRetorno() + i.tiempoRetorno)
        this.listProceso.push(i)
      }
      this.procesoService.getProceso().setPromedioEspera(this.procesoService.getProceso().getPromedioEspera() / this.procesoService.getProceso().getListOriginal().length)
      this.procesoService.getProceso().setPromedioRetorno(this.procesoService.getProceso().getPromedioRetorno() / this.procesoService.getProceso().getListOriginal().length)
    }
  }

  SJF() {
    this.inhabilitarBotones()

    if (this.procesoService.getProceso().getListOriginal().length > 0) {
      let menor: any = []
      let list: any = []

      for (var i of this.procesoService.getProceso().getListOriginal()) {
        list.push(i)
      }

      menor.push(list[0])

      for (var i of this.procesoService.getProceso().getListOriginal()) {
        if (i.duracion < menor[0].duracion) {
          menor = []
          menor.push(i)
        }
      }

      let espera: number = menor[0].duracion
      let retorno: number = menor[0].duracion

      menor[0].tiempoEspera = 0
      menor[0].tiempoRetorno = menor[0].duracion

      this.listProceso.push(menor[0])

      for (var i of list) {
        if (menor[0].id != i.id) {
          retorno += i.duracion
          i.tiempoEspera = espera
          i.tiempoRetorno = retorno

          this.listProceso.push(i)
          espera += i.duracion
        }
        this.procesoService.getProceso().setPromedioEspera(this.procesoService.getProceso().getPromedioEspera() + i.tiempoEspera)
        this.procesoService.getProceso().setPromedioRetorno(this.procesoService.getProceso().getPromedioRetorno() + i.tiempoRetorno)
      }
      this.procesoService.getProceso().setPromedioEspera(this.procesoService.getProceso().getPromedioEspera() / this.procesoService.getProceso().getListOriginal().length)
      this.procesoService.getProceso().setPromedioRetorno(this.procesoService.getProceso().getPromedioRetorno() / this.procesoService.getProceso().getListOriginal().length)
    }
  }

  Prioridad() {
    this.inhabilitarBotones()
    $('.tablaProcesos').find('tr').addClass('activo');
    this.prioridadActiva = true
    this.tamLista = this.procesoService.getProceso().getListOriginal().length;
    this.tiempoRetorno = 0
    this.tiempoEspera = 0
    this.id = 1
  }

  DarPrioridad(data: any) {
    
    if(this.prioridadActiva) {
      
      if(this.tamLista > this.contadorPrioridad) {
        this.contadorPrioridad++
        this.pushProceso(data, true)
        this.procesoService.getProceso().setPromedioEspera(0)
        this.procesoService.getProceso().setPromedioRetorno(0)

        for (var i of this.listProceso) {
          this.procesoService.getProceso().setPromedioEspera(this.procesoService.getProceso().getPromedioEspera() + i.tiempoEspera)
          this.procesoService.getProceso().setPromedioRetorno(this.procesoService.getProceso().getPromedioRetorno() + i.tiempoRetorno)
        }
        this.procesoService.getProceso().setPromedioEspera(this.procesoService.getProceso().getPromedioEspera() / this.procesoService.getProceso().getListOriginal().length)
        this.procesoService.getProceso().setPromedioRetorno(this.procesoService.getProceso().getPromedioRetorno() / this.procesoService.getProceso().getListOriginal().length)
      }
    }
  }

  RoundRobin() {
    this.inhabilitarBotones()
    $('.roundRobin').show('slow')
  }

  RoundRobinProceso(q: any, limpiar: boolean) {

    if(limpiar) {
      this.listProceso = []
      this.procesoService.getProceso().setPromedioEspera(0)
      this.procesoService.getProceso().setPromedioRetorno(0)
    }

    let entrar = true

    // if(q != undefined && q != null && q != '') {
    //   if (this.procesoService.getProceso().getListOriginal().length > 0) {
    //     for (var i of this.procesoService.getProceso().getListOriginal()) {
    //       if(q > i.duracion) {
    //         entrar = false
    //       }
    //     }
    //   }
    // }

    if(entrar) {
      if (this.procesoService.getProceso().getListOriginal().length > 0) {
        for (var i of this.procesoService.getProceso().getListOriginal()) {

          if(i.tiempoEspera != 0) {
            i.tiempoEsperaTemp = i.tiempoEspera - q
          }
          else {
            i.tiempoEsperaTemp = 0
            i.listo = true
          }

          

          console.log(i.tiempoEsperaTemp);
          
          this.procesoService.getProceso().setPromedioEspera(this.procesoService.getProceso().getPromedioEspera() + i.tiempoEspera)
          this.procesoService.getProceso().setPromedioRetorno(this.procesoService.getProceso().getPromedioRetorno() + i.tiempoRetorno)
          this.listProceso.push(i)
        }
        this.procesoService.getProceso().setPromedioEspera(this.procesoService.getProceso().getPromedioEspera() / this.procesoService.getProceso().getListOriginal().length)
        this.procesoService.getProceso().setPromedioRetorno(this.procesoService.getProceso().getPromedioRetorno() / this.procesoService.getProceso().getListOriginal().length)
      }
    } 

    // this.RoundRobinProceso(q, false)
  }

  clear() {
    this.listProceso = []
    this.duracion = ''
    this.tiempoq = ''
    this.id = 1
    this.tiempoRetorno = 0
    this.tiempoEspera = 0
    this.procesoService.getProceso().setListOriginal([])
    this.procesoService.getProceso().setPromedioEspera(0)
    this.procesoService.getProceso().setPromedioRetorno(0)
    this.prioridadActiva = false
    this.contadorPrioridad = 0
    setTimeout(() => {
      $('.tablaProcesos').find('tr').removeClass('activo');
      $('.btn-info, .inputDuracion, .btn-success').removeAttr('disabled');
      $('.roundRobin').hide('slow')
    }, 100)
  }

  inhabilitarBotones() {
    setTimeout(() => {
      $('.btn-info, .inputDuracion, .btn-success').attr('disabled', true);
    }, 100)
  }

}

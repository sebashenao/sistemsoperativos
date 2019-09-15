export class Proceso {
	
	listOriginal: any = []
	promedioEspera: number = 0
	promedioRetorno: number = 0

	getListOriginal() {
		return this.listOriginal
	}

	setListOriginal(listOriginal: any) {
		this.listOriginal = listOriginal
	}

	getPromedioEspera() {
		return this.promedioEspera
	}

	setPromedioEspera(promedioEspera: number) {
		this.promedioEspera = promedioEspera
	}

	getPromedioRetorno() {
		return this.promedioRetorno
	}

	setPromedioRetorno(promedioRetorno: number) {
		this.promedioRetorno = promedioRetorno
	}
}
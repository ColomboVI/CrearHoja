//This sheet evaluación
function ThisSheetEVAL(programa, pais, fecha_ini) {
  this._fecha_ini = new Date(fecha_ini);

  //comprobar que los valores [Fecha Inicio] no están vacios para generar correctamente el directorio
  if (isNaN(this._fecha_ini)) {
    throw 'La fecha establecida de inicio no es correcta';
  }
  this.getFechaIni = function() {
    return this._fecha_ini;
  };

  this.getPrefijoEdicion = function() {
    // [Abreviatura Pais] [ABReviatura Programa] [AÑO_INI][MES_INI][DIA_INI]
    return (
      this._pais.getAbreviatura() +
      ' ' +
      this._programa.getAbreviatura() +
      ' ' +
      this._fecha_ini.getYear() +
      (this._fecha_ini.getMonth() + 1 < 10 ? '0' : '') +
      (this._fecha_ini.getMonth() + 1) +
      (this._fecha_ini.getDate() < 10 ? '0' : '') +
      this._fecha_ini.getDate()
    );
  };

  ThisSheet.call(this, programa, pais);
}

function ThisSheetCHECKIN(programa, pais, q) {
  this._q = q;
  if (!/20(1|2)\d\-Q(1|2|3|4)/.test(this._q)) {
    throw 'El valor de Q (cuatrimestre) no es válido';
  }

  this.getQ = function() {
    return this._q;
  };

  this.getPrefijoEdicion = function() {
    // [ABReviatura Pais] [Abreviatura Programa] [Q] - [PROGRAMA] - [PAIS]
    return (
      this._pais.getAbreviatura() +
      ' ' +
      this._programa.getAbreviatura() +
      ' ' +
      this._q +
      ' - ' +
      this._programa.getNombre() +
      ' - ' +
      this._pais.getNombre()
    );
  };

  ThisSheet.call(this, programa, pais);
}

function ThisSheet(programa, pais) {
  if (typeof ThisSheet.instancia === 'object') {
    return ThisSheet.instancia;
  }

  this._pais = new Pais(pais);
  this._programa = new Programa(programa);

  this.getPrograma = function() {
    return this._programa;
  };

  this.getPais = function() {
    return this._pais;
  };

  ThisSheet.instancia = this;
  //return this;
}

function Pais(valor_pais) {
  if (!valor_pais) throw 'Instancia de Pais mal creada: falta parametro valor_pais';

  if (typeof Pais.instancia === 'object') {
    return Pais.instancia;
  }

  // abrir hoja PROGRAMAS Y EDICIONES
  // https://docs.google.com/spreadsheets/d/17uYmVpkHS7zsN58Tt4U6vnb3qi_hQROEXRlDSFZOVSE/edit#gid=115097576
  var ss_paises = SpreadsheetApp.openById(
    '17uYmVpkHS7zsN58Tt4U6vnb3qi_hQROEXRlDSFZOVSE'
  ).getSheetByName('BUZONES');
  var tabla_paises = new Tabla(
    ss_paises,
    1,
    1,
    ss_paises.getLastRow(),
    ss_paises.getLastColumn(),
    1
  );

  //comprobar que todos los programas tienen valores valores
  for (var i = 1; i <= tabla_paises.getNumFilas(); i++) {
    if (tabla_paises.getFila(i).filter(String).length != tabla_paises.getFila(i).length) {
      SpreadsheetApp.getUi().alert(
        'tabla de paises mal cargados, consultar: https://docs.google.com/spreadsheets/d/17uYmVpkHS7zsN58Tt4U6vnb3qi_hQROEXRlDSFZOVSE/edit#gid=115097576'
      );
      throw 'El pais en posicion ' + i + ' no tiene completas todas las columnas';
    }
  }

  //COMPORBAR QUE EXISTE EL VALOR valor_pais
  var fila_pais = tabla_paises.getNumFilaColumnaIndexValue(valor_pais);

  //instanciar la clase Pais según el valor valor_pais
  Pais.instancia = new TipoPais(
    tabla_paises.getElementoFilaColumna(fila_pais, 'PAIS'),
    tabla_paises.getElementoFilaColumna(fila_pais, 'ABREVIATURA'),
    tabla_paises.getElementoFilaColumna(fila_pais, 'NOMENCLATURA FICHEROS'),
    tabla_paises.getElementoFilaColumna(fila_pais, 'NOMBRE DE EMISOR CORREOS BUZON'),
    tabla_paises.getElementoFilaColumna(fila_pais, 'DIRECCION BUZON'),
    tabla_paises.getElementoFilaColumna(fila_pais, 'LENGUAJE')
  );
  return Pais.instancia;
}

function TipoPais(
  nombre,
  abreviatura,
  nomenclatura_ficheros,
  emisor_buzon,
  direccion_buzon,
  lenguaje
) {
  this._abreviatura = abreviatura;
  this._nombre = nombre;
  this._nomenclatura_ficheros = nomenclatura_ficheros;
  this._emisor_buzon = emisor_buzon;
  this._direccion_buzon = direccion_buzon;
  this._lenguaje = lenguaje;

  this.getNombre = function() {
    return this._nombre;
  };
  this.getAbreviatura = function() {
    return this._abreviatura;
  };
  this.getNombreEmisor = function() {
    return this._emisor_buzon;
  };
  this.getDireccionBuzon = function() {
    return this._direccion_buzon;
  };
  this.getNomenclaturaFicheros = function() {
    return this._nomenclatura_ficheros;
  };
  this.isLenguajeEnglish = function() {
    return this._lenguaje == 'EN';
  };
  this.isLenguajeSpanish = function() {
    return this._lenguaje == 'ES';
  };
}

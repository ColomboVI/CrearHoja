function Tabla(ss_sheet, i0, j0, long_i, long_j, index) {
  //funcion de filtro para eliminar de la tabla las filas cuyo indice no este vacio
  var filtrarIndiceNoVacio = function(array) {
    return array[index - 1] && !/^$/.test(array[index - 1]);
  };
  //obtenemos como array los valores de la tabla indicada por los valores i0, j0, long_i, long_j y filtrada pra que en la columna index siempre haya un valor
  this._vars = ss_sheet
    .getRange(i0, j0, long_i, long_j)
    .getValues()
    //insertamos el indice real al final de la fila
    .map(function(item, index) {
      item.push(index);
      return item;
    })
    /*.map(function(item){return item.trim();})*/
    //nos quedamos solo con las filas cuyo index no está vacio
    .filter(filtrarIndiceNoVacio);
  this._index = index - 1;

  this._ss_sheet = ss_sheet;
  this._j0 = j0;
  this._i0 = i0;

  //Logger.log('valores recuperados de Tabla')
  //Logger.log(JSON.stringify(this._vars))

  this.getFila = function(i) {
    return this._vars[i].slice(0, -1);
  };
  this.getFilaComoObjeto = function(i) {
    var objeto = {};
    this._vars[0].slice(0, -1).forEach(
      (function(valores) {
        return function(item, pos) {
          this[item] = valores[pos];
        };
      })(this._vars[i].slice(0, -1)),
      objeto
    );
    return objeto;
  };

  this.getFilaComoObjetoValores = function(i) {
    var objeto = {};
    objeto[this._vars[0][0]] = this._vars[i][0];
    objeto.valores = [];
    this._vars[0].slice(1, -1).forEach(
      (function(valores) {
        return function(item, pos) {
          this.valores.push({ item: item, valor: valores[pos] });
        };
      })(this._vars[i].slice(1)),
      objeto
    );
    return objeto;
  };

  this._getSpreadsheetFila = function(i) {
    //hemos guardado en el ultimo elemento de una fila el indice de verdad
    return this._vars[i][this._vars[i].length - 1] + this._i0;
  };

  this._getPosicionColumna = function(nombre_columna) {
    var j = this._vars[0].indexOf(nombre_columna);

    if (j == -1) throw 'Columna no encontrada:' + nombre_columna;

    return j;
  };

  this.getElementoFilaColumna = function(i, nombre_columna) {
    if (i < 1) throw 'indice fila debe ser mayor que 0';
    else if (i > this.getNumFilas())
      throw 'indice fila debe ser menor o igual que numero máximo de elementos: ' +
        this.getNumFilas();

    var j = this._getPosicionColumna(nombre_columna);
    return this._vars[i][j];
  };

  this.getElementoFilaColumnaIndex = function(i) {
    if (i < 1) throw 'indice fila debe ser mayor que 0';
    else if (i > this.getNumFilas())
      throw 'indice fila debe ser menor o igual que numero máximo de elementos: ' +
        this.getNumFilas();

    return this._vars[i][this._index];
  };

  this.getNumFilaColumnaIndexValue = function(value) {
    var i = 1;
    while (i <= this.getNumFilas()) {
      if (this.getElementoFilaColumnaIndex(i) == value) return i;
      i++;
    }
    throw 'No se ha encontrado el valor:' + value;
  };

  this.getNumFilas = function() {
    return this._vars.length - 1;
  };

  this.setElementoFilaColumnaValor = function(i, nombre_columna, valor) {
    if (i < 1) throw 'indice fila debe ser mayor que 0';
    else if (i > this.getNumFilas())
      throw 'indice fila debe ser menor o igual que numero máximo de elementos: ' +
        this.getNumFilas();

    var j = this._getPosicionColumna(nombre_columna);
    this._vars[i][j] = valor;
    this._ss_sheet.getRange(this._getSpreadsheetFila(i), this._j0 + j).setValue(valor);
  };
}

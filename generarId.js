function generarId(data) {
  //var id_curso = idPais(data) + "-" + idPrograma(data)+idFecha(data)+idQuarter(data) + "-" +idEdicion(data);
  var id_curso =
    idPais(data) +
    '-' +
    idPrograma(data) +
    idFecha(data) +
    idQuarter(data) +
    '-' +
    generarEdicion(data);
  Logger.log(id_curso);
  return id_curso;
}

//GENERAR ID SIGLA PAIS
function idPais(data) {
  var paisSiglas = {
    España: 'Sp',
    Mexico: 'Mx',
    Argentina: 'Ar',
    Peru: 'Pe',
    Colombia: 'Co',
    EEUU: 'Us',
    Turquia: 'Tk',
    Uruguay: 'Ur'
  };
  for (var pais in paisSiglas) {
    if (data.pais == pais) {
      Logger.log('Pais :' + paisSiglas[pais]);
      return paisSiglas[pais];
    }
  }
}
//GENERAR ID SIGLA CURSO
function idPrograma(data) {
  var programaSiglas = {
    'Data Scientist Fundamentals': 'DScF-',
    'Data Specialist Fundamentals': 'DSpcF-',
    'Datio Immersion': 'DI-',
    'Data Specialist Basics': 'DSB-',
    'Business Analyst': 'BA-'
  };
  for (var programa in programaSiglas) {
    if (data.programa == programa) {
      Logger.log('Programa : ' + programaSiglas[programa]);
      return programaSiglas[programa];
    }
  }
}

//GENERAR ID SIGLA ANO
function idFecha(data) {
  var fecha = new Date(data.fecha_inicio);
  var ano = fecha.getFullYear();
  Logger.log('Fecha ' + ano);
  return ano;
}
//GENERAR ID SIGLA QUARTER
function idQuarter(data) {
  var fecha = new Date(data.fecha_inicio);
  var mes = fecha.getMonth();

  var quarterSiglas = {
    0: 'Q1',
    1: 'Q1',
    2: 'Q1',
    3: 'Q2',
    4: 'Q2',
    5: 'Q2',
    6: 'Q3',
    7: 'Q3',
    8: 'Q3',
    9: 'Q4',
    10: 'Q4',
    11: 'Q4'
  };

  for (var mesInQuarter in quarterSiglas) {
    if (mes == mesInQuarter) {
      Logger.log('Mes : ' + quarterSiglas[mesInQuarter]);
      return quarterSiglas[mesInQuarter];
    }
  }
}
//GENERAR ID SIGLA EDICION
function idEdicion(data) {
  var edicion = data.edicion;
  Logger.log('Edicion ' + edicion);
  return edicion;
}

//Generar Numero Edicion automaticamente en funcion del pais y curso
function generarEdicion(data) {
  var aux = [];
  var cursosEspana = SpreadsheetApp.openById(
    '1W-bXlh6FlBHAR74Lx05HJkUp8Z-hjqDpbARLicP2lfs'
  ).getSheetByName('Cursos RAW');
  var rangoValores = cursosEspana
    .getRange(1, 1, cursosEspana.getLastRow(), cursosEspana.getLastColumn())
    .getValues();
  Logger.log(rangoValores);
  for (var i = 0; i < rangoValores.length; i++) {
    if (rangoValores[i][1] === data.pais && rangoValores[i][4] == data.programa) {
      aux.push(rangoValores[i]);
    }
  }
  var edicion = Number(aux.length) + 1;
  Logger.log('La edición de tu curso es :::: ' + edicion);

  return edicion;
}

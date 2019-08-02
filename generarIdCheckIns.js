function generarIdCheckIn(data) {
  //var id_curso = idPais(data) + "-" + idPrograma(data)+idFecha(data)+idQuarter(data) + "-" +idEdicion(data);
  var id_curso =
    idPaisCheckIn(data) +
    '-' +
    idProgramaCheckIn(data) +
    idFechaCheckIn(data) +
    idQuarterCheckIn(data) +
    '-' +
    generarEdicionCheckIn(data);
  return id_curso;
}

//GENERAR ID SIGLA PAIS
function idPaisCheckIn(data) {
  var paisSiglasCheckIN = {
    España: 'Sp',
    Mexico: 'Mx',
    Argentina: 'Ar',
    Peru: 'Pe',
    Colombia: 'Co',
    EEUU: 'Us',
    Turquia: 'Tk',
    Uruguay: 'Ur'
  };
  for (var pais in paisSiglasCheckIN) {
    if (data.pais == pais) {
      Logger.log('Pais :' + paisSiglasCheckIN[pais]);
      return paisSiglasCheckIN[pais];
    }
  }
}
//GENERAR ID SIGLA CURSO
function idProgramaCheckIn(data) {
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
function idFechaCheckIn(data) {
  var fecha = new Date(data.fecha_inicio);
  var ano = fecha.getFullYear();
  Logger.log('Fecha ' + ano);
  return ano;
}
//GENERAR ID SIGLA QUARTER
function idQuarterCheckIn(data) {
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
function generarEdicionCheckIn(data) {
  var aux = [];
  var cursosEspanaCheckIn = SpreadsheetApp.openById(
    '1W-bXlh6FlBHAR74Lx05HJkUp8Z-hjqDpbARLicP2lfs'
  ).getSheetByName('Check IN RAW');
  var rangoValores = cursosEspanaCheckIn
    .getRange(1, 1, cursosEspanaCheckIn.getLastRow(), cursosEspanaCheckIn.getLastColumn())
    .getValues();
  Logger.log('Entra por aqui');
  Logger.log('programa aqui :: ' + data.programa);
  Logger.log('pais :: ' + data.pais);

  for (var i = 0; i < rangoValores.length; i++) {
    if (rangoValores[i][1] === data.pais && rangoValores[i][3] === data.programa) {
      aux.push(rangoValores[i]);
    }
  }
  var edicion = Number(aux.length) + 1;
  Logger.log('La edición de tu curso es :::: ' + edicion);

  return edicion;
}

function crearID() {
  var cursosEspanaCheckIn = SpreadsheetApp.openById(
    '1W-bXlh6FlBHAR74Lx05HJkUp8Z-hjqDpbARLicP2lfs'
  ).getSheetByName('Check IN RAW');
  var rangoValores = cursosEspanaCheckIn
    .getRange(1, 1, cursosEspanaCheckIn.getLastRow(), cursosEspanaCheckIn.getLastColumn())
    .getValues();
  Logger.log('rango valores' + rangoValores[1]);
  Logger.log('rango valores' + rangoValores[2]);
}

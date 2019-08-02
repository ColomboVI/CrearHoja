function doGet() {
  try {
    var output = HtmlService.createTemplateFromFile('Index');
    var html = output.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME);
    return html;
  } catch (e) {
    return ContentService.createTextOutput(
      JSON.stringify({
        error: e
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function generarEvaluaciones(data) {
  //Cogemos el email del usuario activo para enviar un email si lo solicita.
  var userEmail = Session.getActiveUser().getEmail();

  //Carpeta de destino, donde se generan las  hojas de evalución
  var idCarpetaEvaluaciones = '1e3FaSJSHRM1feRuaK-lPi6YuSz-TkxKs';

  //Instancia nuevo objeto con los valores de los campos Programa, Pais, fecha de inicio
  var this_sheet = new ThisSheetEVAL(data.programa, data.pais, data.fecha_inicio);

  //Construir nombre de la hoja de destino EVAL + prefijo edicion + titulo (si titulo es vacio será vacio pero si tiene dato le añade # al principio)
  var nombre_hoja =
    'EVAL ' + this_sheet.getPrefijoEdicion() + (data.id.trim() != '' ? ' # ' + data.id.trim() : '');

  /********************************
      Crea nuevo fichero con nombre, en la carpeta de destino
      "DriveApp" busca fichero en Drive, en este caso por ID
     "this_sheet.getPrograma()" va a la hoja referencias y busca en la hoja "PROGRAMAS"
     "this_sheet.getIdArchivosEvaluaciones()" devuelve el Id/valor de la columna 'ID PLANTILLA EVALUACIONES' dentro de la hoja PROGRAMAS"
      para un curso determinado
      "makeCopy" crea nuevo fichero con nombre nuevo
      "createFolder" crea nueva carpeta en carpeta destino.
   ***********************************/
  var eval_ss_fichero = DriveApp.getFileById(
    this_sheet.getPrograma().getIdArchivoEvaluaciones()
  ).makeCopy(nombre_hoja, DriveApp.getFolderById(idCarpetaEvaluaciones).createFolder(nombre_hoja));

  /******************
  Copiar valores de Pais y Programa
  Coge id de la hoja nueva
  *************************/
  var eval_ss = SpreadsheetApp.openById(eval_ss_fichero.getId());

  var id_del_curso = generarId(data);
  var emailProfesor = Session.getActiveUser().getEmail();

  eval_ss
    .getSheetByName('Referencias')
    .getRange('PROGRAMA')
    .setValue(data.programa);
  eval_ss
    .getSheetByName('Referencias')
    .getRange('PAIS')
    .setValue(data.pais);
  eval_ss
    .getSheetByName('Referencias')
    .getRange('ID')
    .setValue(id_del_curso);
  eval_ss
    .getSheetByName('Referencias')
    .getRange('PROFESOR')
    .setValue(emailProfesor);

  if (data.enviarEmail) {
    Logger.log('Se va enviar email');
    var message =
      '<h3>Estos son los detalles del curso</h3> \n' +
      '<ul><li> Id Curso : ' +
      id_del_curso +
      '</li>' +
      '<li> Nombre de hoja : ' +
      nombre_hoja +
      '</li>' +
      '<li> Enlace al curso : ' +
      eval_ss.getUrl() +
      '</li></ul>';
    MailApp.sendEmail(userEmail, 'Detalles del curso ID ' + id_del_curso, '', {
      htmlBody: message,
      name: 'Hojas curso'
    });
  }
  //Escribir en la hoja de cursos RAW
  var sigla = idPrograma(data);
  var checkinTabla = SpreadsheetApp.openById(
    '1W-bXlh6FlBHAR74Lx05HJkUp8Z-hjqDpbARLicP2lfs'
  ).getSheetByName('Cursos RAW');
  var now = new Date();
  checkinTabla.appendRow([
    generarEdicion(data),
    data.pais,
    idFecha(data) + idQuarter(data),
    data.fecha_inicio,
    data.programa,
    sigla.replace('-', ''),
    nombre_hoja,
    id_del_curso,
    eval_ss.getUrl(),
    '',
    '',
    '',
    now,
    userEmail
  ]);

  Logger.log(data);
  return {
    datos: data,
    nuevoArchivo: eval_ss.getUrl(),
    nombre_hoja: nombre_hoja,
    id: id_del_curso
  };
}

function generarCheckIn(data) {
  //https://drive.google.com/drive/folders/1kSpylKtmYPoGVecV5tV1lojt1IXpH3R2
  var idCarpetaCheckIn = '1kSpylKtmYPoGVecV5tV1lojt1IXpH3R2';
  var userEmail = Session.getActiveUser().getEmail();
  var quarter = generarQuarter(data);

  //TODO: Aqui es donde tengo que crear lógica para generar id del CheckIN

  var id_del_curso = generarIdCheckIn(data);
  //acceder al id del archivoevaluaciones correspondient
  var this_sheet = new ThisSheetCHECKIN(data.programa, data.pais, quarter);

  //crear una copia, en el sitio indicado con el nombre adecuado
  var nombre_hoja =
    this_sheet.getPrefijoEdicion() + (data.id.trim() != '' ? ' # ' + data.id.trim() : '');

  var eval_ss_fichero = DriveApp.getFileById(
    this_sheet.getPrograma().getIdPlantillaExcelSeguimientoCheckIn()
  ).makeCopy(nombre_hoja, DriveApp.getFolderById(idCarpetaCheckIn));

  //copiar valores de Pais y Programa
  // var id_del_curso = generarId(data);
  var eval_ss = SpreadsheetApp.openById(eval_ss_fichero.getId());

  eval_ss
    .getSheetByName('Datos basicos')
    .getRange('PROGRAMA')
    .setValue(data.programa);
  eval_ss
    .getSheetByName('Datos basicos')
    .getRange('PAIS')
    .setValue(data.pais);
  eval_ss
    .getSheetByName('Datos basicos')
    .getRange('Q')
    .setValue(quarter);
  eval_ss
    .getSheetByName('Datos basicos')
    .getRange('ID')
    .setValue(id_del_curso);
  if (data.enviarEmail) {
    Logger.log('Se va enviar email');
    var message =
      '<h3>Estos son los detalles del curso</h3> \n' +
      '<ul><li> Id Curso : ' +
      id_del_curso +
      '</li>' +
      '<li> Nombre de hoja : ' +
      nombre_hoja +
      '</li>' +
      '<li> Enlace al curso : ' +
      eval_ss.getUrl() +
      '</li></ul>';
    MailApp.sendEmail(userEmail, 'Detalles del curso ID ' + id_del_curso, '', {
      htmlBody: message,
      name: 'Hojas curso'
    });
  }

  //Escribir en la hoja de cursos RAW
  var checkinTabla = SpreadsheetApp.openById(
    '1W-bXlh6FlBHAR74Lx05HJkUp8Z-hjqDpbARLicP2lfs'
  ).getSheetByName('Check IN RAW');
  var now = new Date();
  checkinTabla.appendRow([
    generarEdicionCheckIn(data),
    data.pais,
    idFechaCheckIn(data) + idQuarterCheckIn(data),
    data.programa,
    id_del_curso,
    data.fecha_inicio,
    nombre_hoja,
    eval_ss.getUrl(),
    '',
    '',
    '',
    '',
    '',
    now,
    userEmail
  ]);

  Logger.log(data);
  return {
    datos: data,
    nuevoArchivo: eval_ss.getUrl(),
    nombre_hoja: nombre_hoja,
    id: id_del_curso
  };
}
function pruebaEmail(data) {
  if (data.enviarEmail) {
    Logger.log('Se va enviar email');
    var message =
      '<h3>Estos son los detalles del curso</h3> \n' +
      '<ul><li> Id Curso : ' +
      id_del_curso +
      '</li>' +
      '<li> Nombre de hoja : ' +
      nombre_hoja +
      '</li>' +
      '<li> Enlace al curso : <a href=' +
      eval_ss.getUrl() +
      ' target="_blank"></li></ul>';

    MailApp.sendEmail(userEmail, 'Detalles del curso ID ' + id_del_curso, '', {
      htmlBody: message,
      name: 'Hojas curso'
    });
  }
}

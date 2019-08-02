function generarQuarter(data) {
  var ano_quarter = idFecha(data) + "-" + idQuarter(data)
  Logger.log(ano_quarter)
  return ano_quarter
}

//GENERAR ID SIGLA ANO
function idFecha(data) {
  var fecha = new Date(data.fecha_inicio)
  var ano = fecha.getFullYear()
  Logger.log("Fecha " + ano)
  return ano;
}
//GENERAR ID SIGLA QUARTER
function idQuarter(data) {
  var fecha = new Date(data.fecha_inicio)
  var mes = fecha.getMonth()

  var quarterSiglas = {
    0: "Q1",
    1: "Q1",
    2: "Q1",
    3: "Q2",
    4: "Q2",
    5: "Q2",
    6: "Q3",
    7: "Q3",
    8: "Q3",
    9: "Q4",
    10: "Q4",
    11: "Q4"
  }

  for (var mesInQuarter in quarterSiglas) {
    if (mes == mesInQuarter) {
      Logger.log("Mes : " + quarterSiglas[mesInQuarter])
      return quarterSiglas[mesInQuarter]

    }
  }
}

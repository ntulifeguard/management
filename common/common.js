function gviz_query(ss_id, query, column_headers) {
  var query_encoded = encodeURIComponent(query)
  var url = Utilities.formatString("https://docs.google.com/spreadsheets/d/%s/gviz/tq?tq=%s", ss_id, query_encoded) 
  var response = UrlFetchApp.fetch(url)
  Logger.log(url)
  var text = response.getContentText()
  Logger.log(text)
  var pat = /"rows":\[{"c":(.*)}]}}\);/ig
  var r = pat.exec(text)
  if( r == null ) {
    return null
  }
  
  var data = JSON.parse(r[1])
  
  var obj = {}
  var i =0;
  for(var d in column_headers) {
    if( data[i] != null ) {
      obj[d] = data[i]["v"]      
    } else {
      obj[d] = ""
    }
    i++
  }
  
  return obj
}

var column_headers = get_columnHeaders(id.ss)

function get_userData(email) {
  if( column_headers != null ) {
    var query = Utilities.formatString("select * where ( %s = '%s' )", column_headers["Email"], email)
    var userData = gviz_query(id.ss, query, column_headers)
    return userData
  } else {
    return null
  }
}


function get_columnHeaders() {
  var gviz_url = Utilities.formatString("https://docs.google.com/spreadsheets/d/%s/gviz/tq?tq=select%%20*%%20where%%20(%%20A%%20%%3D%%20-1%%20)", id.ss) 

  var response = UrlFetchApp.fetch(gviz_url)
  var code = response.getResponseCode()
  var text = response.getContentText()
  //Logger.log(text)
  var pat = /table":({.+)}\);/ig
  //
  var r = pat.exec(text)
  if( r == null ) {
    //Logger.log("not found")
    return null
  }
  
  var data = JSON.parse(r[1]);

  var cols = data["cols"]
  var obj = {}
  for( var i in cols ) {

    obj[cols[i]["label"]] = cols[i]["id"]
  }
  return obj
}
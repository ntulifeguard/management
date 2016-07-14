function gviz_query(ss_id, query, user, columnHeaders) {
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
  
//  var obj = {}
  var i =0;
  for(var d in columnHeaders) {
    if( data[i] != null ) {
      user[d] = data[i]["v"]
    } else {
      user[d] = ""
    }
    i++
  }
  
  var objcount = 0;
  for( var o in columnHeaders ) {
    objcount++
  }

  if( objcount > 0 ) {
    return true
  } else {
    user = {}
    return false
  }
  
}


function get_userData(email, user, columnHeaders) {
  if( Object.keys(columnHeaders).length > 0 ) {
    var query = Utilities.formatString("select * where ( %s = '%s' )", columnHeaders["Email"], email)
    gviz_query(id.ss, query, user, columnHeaders)
    Logger.log(user)
  } else {
    ;;
  }
}


function get_columnHeaders(columnHeaders) {
  var gviz_url = Utilities.formatString("https://docs.google.com/spreadsheets/d/%s/gviz/tq?tq=select%%20*%%20where%%20(%%20A%%20%%3D%%20-1%%20)", id.ss) 
  Logger.log(arguments.callee.name+":"+gviz_url)
  var response = UrlFetchApp.fetch(gviz_url)
  var code = response.getResponseCode()
  var text = response.getContentText()
  Logger.log(arguments.callee.name+":"+text)
  var pat = /table":({.+)}\);/ig
  //
  var r = pat.exec(text)
  if( r == null ) {
    Logger.log(arguments.callee.name+":"+"not found")
    return null
  }

  var data = JSON.parse(r[1]);
  Logger.log(arguments.callee.name+":data")
  Logger.log(data)
  
  var cols = data["cols"]

  for( var i in cols ) {
   
    var label = cols[i]["label"]
    if( label != "" ) {
      columnHeaders[label] = cols[i]["id"]
    }
  }
  
  var objcount = 0;
  for( var o in columnHeaders ) {
    objcount++
  }
  
  Logger.log(arguments.callee.name+":columnHeaders")
  Logger.log(columnHeaders)
  
  if( objcount < 1 ) {
    columnHeaders = {}
    return false
  } else {
    return true
  }
  
  
}
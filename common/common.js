function sizeOf(obj) {
  return Object.keys(obj).length 
}

function gviz_query(ss_id, query, user, columnHeaders) {
  var query_encoded = encodeURIComponent(query)
  var url = Utilities.formatString("https://docs.google.com/spreadsheets/d/%s/gviz/tq?tq=%s", ss_id, query_encoded) 
  var response = UrlFetchApp.fetch(url)
  var text = response.getContentText()

//  var pat = /"rows":\[{"c":(.*)}]}}\);/ig
  var pat = /table":({.+)}\);/ig
  var r = pat.exec(text)
  if( r == null ) {
    return false
  }
  
  var data = JSON.parse(r[1])
  if( data["rows"].length == 0 ) {
    user = {}
    return true
  }

  var i =0;
  // [{c=[{v=Date(2016,6,15,10,51,14), f=7/15/2016 10:51:14}, ... ]}]
  try {
    for(var d in columnHeaders) {
      var rows = data["rows"]
      var values = rows[0]["c"]
      if( values[i] != null ) {
        user[d] = values[i]["v"]
      } else {
        user[d] = ""
      }
      i++
    }
  } catch(e) {
    return false
  }

  if( sizeOf(user) > 0 ) {
    return true
  } else {
    // we have row data but failed to parse it.
    user = {}
    return false 
  }
  
}


function get_userData(email, user, columnHeaders) {
  if( sizeOf(columnHeaders) > 0 ) {
    var query = Utilities.formatString("select * where ( %s = '%s' )", columnHeaders["Email"], email)
    var ret_gviz = gviz_query(id.ss, query, user, columnHeaders) 
    
    return ret_gviz   
  } else {
    return false
  }
}


function get_accountName(email) {
  
  if( email != null ) {
    var account = email.split("@")[0]
    return account
  } else {
    return null
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
    columnHeaders = {}
    return false
  }

  try {
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
  } catch(e) {
    columnHeaders = {}
    return false
  }
  
  Logger.log(arguments.callee.name+":columnHeaders")
  Logger.log(columnHeaders)
  
  if( sizeOf(columnHeaders) < 1 ) {
    columnHeaders = {}
    return false
  } else {
    return true
  } 
}
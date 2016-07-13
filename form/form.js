var form = FormApp.openById(id.form);
var email = Session.getActiveUser().getEmail()

function installTrigger() {
  ScriptApp.newTrigger('onSubmit')
     .forForm(form)
     .onFormSubmit()
     .create();
}

function onSubmit(e) {
  Logger.log(e)
  var form_title = form.getTitle()
  var formResponse = e.response 

  var prefilledUrl = formResponse.toPrefilledUrl()
  var formResponse_id = formResponse.getId()
  var itemResponses = formResponse.getItemResponses()
  
  Logger.log("prefilledUrl="+prefilledUrl)
  Logger.log("formResponse_id="+formResponse_id)
  Logger.log("form_title="+form_title)
  
  var ss = SpreadsheetApp.openById(id.ss)
  var sheet = ss.getSheets()[0]
  
  var inputed_email = null
  for(var i in itemResponses) {
    var item = itemResponses[i].getItem()
    var title = item.getTitle()
    if( title == "Email" ) {
      inputed_email = itemResponses[i].getResponse()
    }
  }
  
  Logger.log("inputed_email="+inputed_email)
  
  var retries = 0;
  var index = get_rowNumber(inputed_email)

  Logger.log("index="+index)

  if( index > 0 ) {
    var cell = comm.column_headers["edit2_id"] + index.toString()
    Logger.log(cell)
    var r_edit2 = sheet.getRange(cell)
    r_edit2.setValue(formResponse_id)
  }
 
  return
}


function get_rowNumber(inputed_email) {
  var url = Utilities.formatString("https://docs.google.com/spreadsheets/d/%s/gviz/tq?tq=select%%20%s", id.ss, comm.column_headers["Email"])
  
  var response = UrlFetchApp.fetch(url)
  var text = response.getContentText()
  Logger.log(text)

  var pat = /"rows":(.+)}}\);/ig
  var list = pat.exec(text)
  //var r = text.match(pat)
  if( list == null ) {
    Logger.log("not found")
    return null
  }
  
  var data = JSON.parse(list[1]); 
  var found = false;
  var row_index;
  Logger.log(data)
  
  for(row_index=0;row_index<data.length;row_index++) {
    Logger.log(data[row_index])
    if( data[row_index]["c"][0]["v"] == inputed_email ) {
      found = true;
      Logger.log("Found")
      Logger.log("row_index="+row_index)
      break;
    }   
  }

  if(found) {
    row_index=row_index+2;
    return (row_index);
  } else {
    return -1
  }
  
}

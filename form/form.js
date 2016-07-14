var form = FormApp.openById(id.form);
var email = Session.getActiveUser().getEmail()

function installTrigger() {
  ScriptApp.newTrigger('onSubmit')
     .forForm(form)
     .onFormSubmit()
     .create();
}

var columnHeaders = {}
var user = {}

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

  if( comm.get_columnHeaders(columnHeaders) ) {
    Logger.log(columnHeaders)
  } else {
    throw "Failed to call columnHeaders()"
  }

  comm.get_userData(email, user, columnHeaders)
  
  Logger.log("inputed_email="+inputed_email)
  
  var retry_max = 3;
  for( var i=0; i<retry_max; i++ ) { 
    var index = get_rowNumber(inputed_email, columnHeaders)
    Logger.log("index="+index)
    
    if( index > 0 ) {
      var cell = columnHeaders["edit2_id"] + index.toString()
      
      Logger.log(cell)      
      var r_edit2 = sheet.getRange(cell)
      r_edit2.setValue(formResponse_id)
      
      break
    } else {
      Logger.log("Failed to get edit2_id column")
    }    
  }
 
  //
  update_imageNames()
 
  return
}

function update_imageNames() {
  var account = comm.get_accountName(email)  
  var folder_imageRoot = DriveApp.getFolderById(id.imageFolder);
  var folders = folder_imageRoot.getFoldersByName(account)
  
  while (folders.hasNext()) {
    var folder_user = folders.next()
    var files = folder_user.getFiles()
      while (files.hasNext()) {
        var file = files.next();
        var fileName = file.getName()
        var ext = fileName.split('.').pop();
        for(var i in comm.cht_list) {
          var assumedName = Utilities.formatString("%s_%s.%s", comm.cht_list[i], account, ext)
          
          if( fileName == assumedName ) {
            var newName = Utilities.formatString("%03d.%02d-%s_%s", user["期數"], user["號碼"], user["姓名"], assumedName)
            file.setName(newName)
          }
        }
      }
  }
   
}


function get_rowNumber(inputed_email, columnHeaders) {
  var url = Utilities.formatString("https://docs.google.com/spreadsheets/d/%s/gviz/tq?tq=select%%20%s", id.ss, columnHeaders["Email"])
  var response = UrlFetchApp.fetch(url)
  var text = response.getContentText()
  
  var pat = /"rows":(.+)}}\);/ig
  var list = pat.exec(text)
  //var r = text.match(pat)
  if( list == null ) {
    Logger.log("get_rowNumber(): not found")
    return null
  }
  
  var data = JSON.parse(list[1]); 
  var found = false;
  var row_index;
  //Logger.log(data)
  
  for(row_index=0;row_index<data.length;row_index++) {
    Logger.log(data[row_index])
    if( data[row_index]["c"][0]["v"] == inputed_email ) {
      found = true;
      Logger.log("get_rowNumber: Found")     
      break;
    }   
  }

  if(found) {
    row_index=row_index+2;
    Logger.log("row_index="+row_index)
    return (row_index);
  } else {
    return -1
  }
  
}

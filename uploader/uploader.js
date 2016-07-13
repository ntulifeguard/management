var email = Session.getActiveUser().getEmail()
//var user = comm.get_userData(email)

function doGet(e) {
  return HtmlService.createTemplateFromFile('form.html')
    .evaluate()
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

function get_class_number_name() {
  //var gviz_querystr = Utilities.formatString("https://docs.google.com/spreadsheets/d/%s/gviz/tq?tq=select%%20%s%%20where%%20(%s%%3D%%22%s%22)", id.ss, edit2_column, email_column, email_encoded)
  var email_encoded = encodeURIComponent(email)
  
  var column_headers = comm.get_columnHeaders(id.ss)
  

  var gviz_querystr = Utilities.formatString("https://docs.google.com/spreadsheets/d/%s/gviz/tq?tq=select%%20%s%%2C%%20%s%%20%%2C%s%%20where%%20(%s%%20%%3D%%20%%22%s%%22)", id.ss, column_headers["期數"], column_headers["號碼"], column_headers["姓名"], column_headers["Email"], email_encoded)                 

  var response = UrlFetchApp.fetch(gviz_querystr)
  var text = response.getContentText()
  Logger.log(text)
  var pat = /"c":(.*)}]}}\);/ig
  
  var r = pat.exec(text)
  if( r == null ) {
    return null
  }  
  
  var data = JSON.parse(r[1]);
  
  var class = null
  var number = null
  var name = null
  
  try {
    class = data[0]["v"]
  } catch(e) {
    //
  }
  
  try {
    number = data[1]["v"]
  } catch(e) {
    //
  }
  
  try {
    name = data[2]["v"]
  } catch(e) {
    //
  }
  
  
  Logger.log(class)
  Logger.log(number)
  Logger.log(name)
  return [class,number,name]
}

function get_userClass() {
  
  
  Logger.log(header)
}

function processForm(theForm) {
  var list = ["headshot","license1","license2"]
  var cht_list = ["大頭照", "救生證", "教練證"]
  var class_number_name = get_class_number_name()
  try {
    for( var l in list ) {
      var fileBlob = theForm[list[l]];
      var oriname = fileBlob.getName()
      if( oriname == '' ) {
        continue
      }
      var ext = oriname.split('.').pop();
      var newname = Utilities.formatString("%03d.%02d-%s_%s.%s", class_number_name[0], class_number_name[1], class_number_name[2], cht_list[l], ext)
      //var newname = Utilities.formatString("%03d.%02d-%s_%s.%s", user["期數"], user["號碼"], user["姓名"], cht_list[l], ext)
      
      fileBlob.setName(newname)
      Logger.log("fileBlob Ori Name: " + oriname)
      Logger.log("fileBlob New Name: " + newname)
      Logger.log("fileBlob type: " + fileBlob.getContentType())
      Logger.log('fileBlob: ' + fileBlob);
    
      var fldrSssn = DriveApp.getFolderById(id.imageFolder);
        fldrSssn.createFile(fileBlob);
    }   
  } catch(e) {
    throw 0
  }
}



var email = Session.getActiveUser().getEmail()
var user = comm.get_userData(email)
  
function doGet(e) {
  return HtmlService.createTemplateFromFile('form.html')
    .evaluate()
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}


function processForm(theForm) {
  var list = ["headshot","license1","license2"]
  var cht_list = ["大頭照", "救生證", "教練證"]
       
  try {
    for( var l in list ) {
      var fileBlob = theForm[list[l]];
      var oriname = fileBlob.getName()
      if( oriname == '' ) {
        continue
      }
       
      var ext = oriname.split('.').pop();
      var newname = Utilities.formatString("%03d.%02d-%s_%s.%s", user["期數"], user["號碼"], user["姓名"], cht_list[l], ext)
      
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



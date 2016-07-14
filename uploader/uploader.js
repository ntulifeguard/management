var email = Session.getActiveUser().getEmail()
var user = {}
var columnHeaders = {}
  
function doGet(e) {
  return HtmlService.createTemplateFromFile('form.html')
    .evaluate()
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}


function processForm(theForm) {
  var list = ["headshot","license1","license2"]
       
  comm.get_columnHeaders(columnHeaders)
  comm.get_userData(email, user, columnHeaders)
  
  var account = comm.get_accountName(email)   
  Logger.log("account="+account)
  try {
    for( var l in list ) {
      var fileBlob = theForm[list[l]];
      var oriname = fileBlob.getName()
      if( oriname == '' ) {
        continue
      }
       
      var ext = oriname.split('.').pop();
      var user_size = Object.keys(user).length
      
      if( user_size > 0 ) {
        var newname = Utilities.formatString("%03d.%02d-%s_%s_%s.%s", user["期數"], user["號碼"], user["姓名"], comm.cht_list[l], account, ext)
      } else {
        var newname = Utilities.formatString("%s_%s.%s", comm.cht_list[l], account, ext)
      }
      
      fileBlob.setName(newname)
      Logger.log("fileBlob Ori Name: " + oriname)
      Logger.log("fileBlob New Name: " + newname)
      Logger.log("fileBlob type: " + fileBlob.getContentType())
      Logger.log('fileBlob: ' + fileBlob);
    
      var folder_imageRoot = DriveApp.getFolderById(id.imageFolder);
      var folders = folder_imageRoot.getFoldersByName(account)
      if( folders.hasNext() ) {
        var folder_user = folders.next()
        folder_user.createFile(fileBlob);
      } else {
        var new_folder_user = folder_imageRoot.createFolder(account)
        new_folder_user.createFile(fileBlob);
      }

    }   
  } catch(e) {
    throw 0
  }
}



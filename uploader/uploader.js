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


  var uploaded_count = 0
  var noname_count = 0
  var account = comm.get_accountName(email)   
  Logger.log("account="+account)
  try {
    for( var l in list ) {
      var fileBlob = theForm[list[l]];
      var oriname = fileBlob.getName()
      if( oriname == '' ) {
        noname_count++
        continue
      }
       
      var ext = oriname.split('.').pop();
      
      if( comm.sizeOf(user) > 0 ) {
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
        var new_file = folder_user.createFile(fileBlob);
      } else {
        var new_folder_user = folder_imageRoot.createFolder(account)
        var new_file = new_folder_user.createFile(fileBlob);
      }
      
      if( new_file.getSize() > 0 ) {
        uploaded_count++
      }
    }  
    
    if( noname_count == list.length ) {
      throw "為什麼沒選檔案就按上傳？抬頭捷摸兩邊水道頭，出發。"
    }    
    
    Logger.log(uploaded_count+ " files uploaded")
    
  } catch(e) {
    throw e
  }
}



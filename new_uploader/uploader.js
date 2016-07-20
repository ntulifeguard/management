var email = Session.getActiveUser().getEmail()
var user = {}
var columnHeaders = {}
  
  
function doGet(e) {
  return HtmlService.createTemplateFromFile('form.html')
    .evaluate()
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}


function processForm(theForm) {
  var list = ["headShot","idFront","idBack"]
  var cht_list = ["大頭照","身份證件正面","身份證件反面"]
       
  var uploaded_count = 0
  var toUpload_count = 0

  var userClass = theForm["userClass"]
  var userName = theForm["userName"]
  var userNumber = theForm["userNumber"]

  try {
    for( var l in list ) {
      var fileBlob = theForm[list[l]];
      var oriname = fileBlob.getName()
      if( oriname != '' ) {
        toUpload_count++
      } else {
        continue
      }
      
      if( oriname.indexOf(".") > 0 ) {
        var ext = oriname.split('.').pop();
      } else {
        var ext = "noext"
      }
      
      var newname = Utilities.formatString("%03d.%02d-%s_%s.%s", userClass, userNumber, userName, cht_list[l], ext)
      
      fileBlob.setName(newname)
      Logger.log("fileBlob Ori Name: " + oriname)
      Logger.log("fileBlob New Name: " + newname)
      Logger.log("fileBlob type: " + fileBlob.getContentType())
      Logger.log('fileBlob: ' + fileBlob);
    
      var folder_imageRoot = DriveApp.getFolderById(id.imageFolder);
      var new_file = folder_imageRoot.createFile(fileBlob);

      if( new_file.getSize() > 0 ) {
        uploaded_count++
      }
    }  
    
    if( toUpload_count != uploaded_count ) {
      throw "上傳錯誤，請檢查檔案再次上傳"
    }
    
    Logger.log(uploaded_count+ " files uploaded")
    
  } catch(e) {
    throw e
  }
}



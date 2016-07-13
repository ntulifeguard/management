var this_version = "v0.1"

var email = Session.getActiveUser().getEmail()
var language_code = "zh_TW"

var service_url = ScriptApp.getService().getUrl() + "&hl=" +language_code
var user = comm.get_userData(email)


function doGet(e) {
  return HtmlService
      .createTemplateFromFile('index')
      .evaluate()
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}


function get_usexrData() {
  var column_headers = comm.get_columnHeaders(id.ss)
  
  var query = Utilities.formatString("select * where ( %s = '%s' )", column_headers["Email"], email)
  var userData = comm.gviz_query(id.ss, query, column_headers)
  
  return userData
}


function get_formEdit2Url(edit2_id) {
  var url = Utilities.formatString("https://docs.google.com/forms/d/%s/viewform?edit2=%s&hl=%s", id.form, edit2_id, language_code)
  return url
}


function get_newFormUrl() {
  var url = Utilities.formatString("https://docs.google.com/forms/d/%s/viewform?entry.2081293511=%s&hl=%s", id.form, email, language_code)
  return url

}


function get_umUrl() {
  var um_url = null;
   
  if( user == null ) {
    um_url = get_newFormUrl(email)
  } else {
    var edit2_id = user["edit2_id"]
    um_url = get_formEdit2Url(edit2_id)
  }
  Logger.log(um_url)
  return um_url
}


function get_logoutUrl() {
  var logout_str = Utilities.formatString("https://accounts.google.com/Logout?continue=%s&hl=%s", service_url, language_code)
  return logout_str
}


function get_uploaderUrl() {
  var url = Utilities.formatString("https://script.google.com/macros/s/%s/exec?hl=%s", id.uploader_dev, language_code)
  return url
}


function get_messageBoardUrl() {
  var url = Utilities.formatString("https://docs.google.com/document/d/%s/edit", id.messageBoard)
  return url
}

function get_greetingText() {
  var text = "新朋友你好!"
  if( user ) {
    if( user["期數"] ) {
      text = Utilities.formatString("歡迎 %s 期的夥伴!", user["期數"])
    } 
  }
  
  return text
}


function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}
var this_version = "v1.0"

var email = Session.getActiveUser().getEmail()
var language_code = "zh_TW"
var service_url = ScriptApp.getService().getUrl() + "&hl=" +language_code

var user = {}
var columnHeaders = {}


function doGet(e) {
  Logger.log(e)
  
  var ret_columnHeaders = comm.get_columnHeaders(columnHeaders)
  var ret_userData = comm.get_userData(email, user, columnHeaders)

  return HtmlService
      .createTemplateFromFile('index')
      .evaluate()
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
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
   
  if( comm.sizeOf(user) < 1 ) {
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


function get_randomText() {
  var text = randomText[Math.floor(Math.random()*randomText.length)]
  
  return text
}


function get_greetingText() {
  var text = "新朋友你好!"

  if( comm.sizeOf(user) > 0 ) {
    if( user["期數"] ) {
      var text = Utilities.formatString("歡迎 %s 期的救生員!", user["期數"])
    } 
  }
  
  return text
}


function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
    .getContent();
}
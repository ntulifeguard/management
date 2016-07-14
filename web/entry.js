var this_version = "v0.1"

var email = Session.getActiveUser().getEmail()
var language_code = "zh_TW"

var service_url = ScriptApp.getService().getUrl() + "&hl=" +language_code
//var user = comm.get_userData(email)

var user = {}
var columnHeaders = {}

function doGet(e) {
 
  comm.get_columnHeaders(columnHeaders)
  comm.get_userData(email, user, columnHeaders)
  
  Logger.log(e)
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
   
  if( Object.keys(user).length < 1 ) {
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
  var randomText = [ 
  // 口號
  "停，標齊對正三二一", 
  "不要怕我來救你了",
  "稍息之後不要忘記禮節，稍息",
  "現在請你把手搭在我的肩上，我們一起游回去",
  "通通友向左向右轉",
  "抬頭捷就水操位置",
  "現在從我左手邊依序一伍一伍一二報數，報一的舉手，報二的不舉手，開始報數",
  "向下標齊什麼，黑線",
  "向前標齊什麼，圓錐",
  // 歌
  "♬ 找一個沒有人知道的方向",
  "♬ 沒有城市的霓虹",
  "♬ 明明醒著的午後",
  "♬ 畫面越來越燦爛",
  "♬ 蔚藍的天空坦蕩心胸",
  "♬ 苦澀的沙吹痛臉龐的感覺",
  "♬ 有多少創傷卡在咽喉",
  "♬ 我以為我已經累了",
  "♬ 只要不醒過來 這就不是夢",
  "♬ 當 我和世界不一樣",
  "♬ 我的心內感覺人生的沈重",
  // 阿瓦隆
  "現在請除了莫德雷德以外的壞人伸出你的大拇指",
  "現在請梅林與梅乾菜伸出你的大拇指",
  "這個組合我可以",
  "現在好人不要有任何反應，讓壞人猜梅林",
  "第一局敢出失敗的壞人就只有...",
  // 工程師
  "橫向的捲動文字讓人有回到90年代的感覺",
  // 陳星魚
  "Have you heard of Elder Scroll?",
  "ARE YOU READY FOR THIS SUNDAY NIGHT WHEN WWE CHAMP JOHN CENA DEFENDS HIS TITLE IN THE WWE SUPER SLAM?",
  ]
  
  var text = randomText[Math.floor(Math.random()*randomText.length)]
  
  return text
}


function get_greetingText() {
  var text = "新朋友你好!"

  if( Object.keys(user).length > 0 ) {
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
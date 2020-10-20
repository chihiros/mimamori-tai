function doPost(e) {
  var json = JSON.parse(e.postData.getDataAsString());
  if (isPublicRepository(json)) {
    var txt = "<@suzurikawa_chihiro>さん！！タイ変だよ！！\n"+actions[json["action"]]+getRepositoryLink(json);
    callSlackWebhookAlert(txt);
  } else {
    if (json["action"] === "privatized") {
      var txt = "privateリポジトリに変更してくれてありがとう！！\n"+getRepositoryLink(json)
      callSlackWebhookAlert(txt);
    }
  }
}

var SLACK_WEBHOOK_URL = '**** WebHookのURLはここに貼る ****';
var actions = {
  "created":"publicリポジトリが作成された！！\n",
  "publicized":"publicリポジトリに変更された！！\n",
  "transferred":"publicリポジトリが転送されてきた！！\n",
  "privatized":"privateリポジトリに変更してくれてありがとう\n"
};
Object.freeze(actions);

function isPublicRepository(json) {
  return !json["repository"]["private"];
}

function getRepositoryLink(json) {
  return "<"+json["repository"]["html_url"]+"|"+json["repository"]["full_name"]+">\n";
}

function callSlackWebhookAlert(txt) {  
  var params = {
  method: 'post',
  contentType: 'application/json',
  payload: JSON.stringify({
    "text":txt,
    "blocks": [{
      "type": "context",
      "elements": [{
        "type": "mrkdwn",
        "text": txt
      }]
    }]
  })
};
  var response = UrlFetchApp.fetch(SLACK_WEBHOOK_URL, params);
  return response;
}

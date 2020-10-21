function doPost(e) {
  console.log('Hello GAS World.');
  let json = JSON.parse(e.postData.getDataAsString());
  console.log('Hello GAS World.');
  console.log(json);
  let message = getMessage(json);
  let log = callSlackWebhook(message);
}

const MENTION = "<@suzurikawa_chihiro>";
const SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/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';
const ACTIONS = {
  "created"    :"publicリポジトリが作成された！！\n",
  "publicized" :"publicリポジトリに変更された！！\n",
  "transferred":"publicリポジトリが転送されてきた！！\n",
  "privatized" :"privateリポジトリに変更してくれてありがとう\n",
  "deleted"    :"publicリポジトリが削除されたよ\n"
};
Object.freeze(MENTION);
Object.freeze(SLACK_WEBHOOK_URL);
Object.freeze(ACTIONS);

function getMessage(json) {
  let message = "";
  if (isPublicRepository(json)) {
    // publicリポジトリを作成、更新、削除した時の処理
    if (json["action"] === "deleted") {
      message = MENTION+"さん！！\n";
      message += getActionMessage(json);
      message += getRepositoryLink(json);
      return message;
    }
    message = MENTION+"さん！！タイ変だよ！！\n";
    message += getActionMessage(json);
    message += getRepositoryLink(json);
    return message;
  } else {
    // privateリポジトリを作成、更新、削除した時の処理
    if (json["action"] === "privatized") {
      message = getActionMessage(json);
      message += getRepositoryLink(json);
      return message;
    }
  }
}

function isPublicRepository(json) {
  return !json["repository"]["private"];
}

function getActionMessage(json) {
  return ACTIONS[json["action"]];
}

function getRepositoryLink(json) {
  return "<"+json["repository"]["html_url"]+"|"+json["repository"]["full_name"]+">\n";
}

function callSlackWebhook(message) {  
  let params = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({
      "text":message,
      "blocks": [{
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": message
        }
      }]
    })
  };
  let response = UrlFetchApp.fetch(SLACK_WEBHOOK_URL, params);
  return response;
}
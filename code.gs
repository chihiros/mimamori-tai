function doPost(e) {
  let json = JSON.parse(e.postData.getDataAsString());
  let message = getMessage(json);
  let log = callSlackWebhook(message);
}

const MENTION = "<@suzurikawa_chihiro>";
const SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/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';
const ACTIONS = {
  "created"    :"publicリポジトリを作成したよ\n",
  "publicized" :"publicリポジトリに変更したよ\n",
  "transferred":"publicリポジトリを転送して来たよ\n",
  "privatized" :"privateリポジトリに変更したよ\n",
  "deleted"    :"publicリポジトリを削除したよ\n"
};
Object.freeze(MENTION);
Object.freeze(SLACK_WEBHOOK_URL);
Object.freeze(ACTIONS);

function getMessage(json) {
  let message = "";
  if (isPublicRepository(json)) {
    // publicリポジトリを作成、更新、削除した時の処理
    message = MENTION+"さん\n";
    message += getSenderMassage(json);
    message += getActionMessage(json);
    message += getRepositoryLink(json);
    return message;
  } else {
    // privateリポジトリを作成、更新、削除した時の処理
    if (json["action"] === "privatized") {
      message += getSenderMassage(json);
      message = getActionMessage(json);
      message += getRepositoryLink(json);
      return message;
    }
  }
}


function isPublicRepository(json) {
  return !json["repository"]["private"];
}

function getSenderMessage(json) {
  return json["sender"]["login"]+"さんが";
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

function doPost(e) {
  let json = JSON.parse(e.postData.getDataAsString());
  let message = getMessage(json);
  callSlackWebhook(message);
}

const MENTION = "<!channel>"; // <@user_id> // <!channel> // <!here>
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
    message = MENTION+"さん\n";
    message += getSenderMessage(json);
    message += getActionMessage(json);
    message += getRepositoryLink(json);
    return message;
  } else {
    if (json["action"] === "privatized") {
      message = getSenderMessage(json);
      message += getActionMessage(json);
      message += getRepositoryLink(json);
      return message;
    }
  }
}

function isPublicRepository(json) {
  return !json["repository"]["private"];
}

function getSenderMessage(json) {
  return "<"+json["sender"]["html_url"]+"|"+json["sender"]["login"]+">さんが";
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

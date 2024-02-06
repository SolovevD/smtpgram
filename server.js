const SMTPServer = require("smtp-server").SMTPServer;
const simpleParser = require('mailparser').simpleParser;
require('dotenv').config()
const { Telegraf } = require('telegraf')
const { message } = require('telegraf/filters')
const https = require('https');
const { start } = require("repl");
const bot = new Telegraf(process.env.BOT_TOKEN)
let telegram = bot.telegram;

chat_id = process.env.CHAT_ID;
topic = process.env.TOPIC;
telegraph_token = process.env.TELEGRAPH_TOKEN
port = process.env.PORT;
debug = process.env.DEBUG;
language = process.env.LANGUAGE


function texts(text, language) {
  if (language == 'ru') {
    switch (text) {
      case 'more':
        var result = 'Подробнее';
        break;
    }
  }

  if (language == 'en') {
    switch (text) {
      case 'more':
        var result = 'More';
        break;
    }
  }
  return result;
}


const server = new SMTPServer({
  authOptional: true,
  logger: process.env.debug,
  //catch smtp message and parse it
  onData(stream, session, callback) {
    simpleParser(stream).then(mail => {
      //parsed data
      mail_from = mail.from.text;
      mail_to = mail.to.text;
      mail_subject = mail.subject;
      if (mail.text != undefined && mail.text != '\n') {
        mail_text = mail.text;
      } else {
        mail_text = mail_subject;
      }
      //mail body to telegraph
      https.get('https://api.telegra.ph/createPage?access_token=' + telegraph_token + '&title=' + mail_subject + '&author_name=IT-teka+bot&content=[{"tag":"p","children":["' + mail_text + '"]}]', (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
          data += chunk;
        });
        resp.on('end', () => {
          telegraph_url = JSON.parse(data).result.url;
          //send message to tg
          telegram.sendMessage(chat_id, mail_from + "\n" + mail_subject + '\n', { message_thread_id: topic, reply_markup: { inline_keyboard: [[{ text: texts('more', language), url: telegraph_url }]] } });
        });
      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
    });
    stream.on("end", callback);
  },
});
//server.on(start)
server.listen(2525, '0.0.0.0');

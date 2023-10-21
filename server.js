const SMTPServer = require("smtp-server").SMTPServer;
const simpleParser = require('mailparser').simpleParser;
require('dotenv').config()
const { Telegraf } = require('telegraf')
const { message } = require('telegraf/filters')
const https = require('https');

const bot = new Telegraf(process.env.BOT_TOKEN)
let telegram = bot.telegram;

chat_id = process.env.CHAT_ID;
topic = process.env.TOPIC;
telegraph_token = process.env.TELEGRAPH_TOKEN
port = process.env.PORT;
logs = process.env.LOGGER;

const server = new SMTPServer({
  authOptional: true,
  logger: true,
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
      telegram.sendMessage(chat_id, mail_from + "\n" + mail_subject + '\n', { message_thread_id: topic, reply_markup: { inline_keyboard: [[{ text: 'Подробнее', url: telegraph_url }]] } });
        });
      }).on("error", (err) => {
        console.log("Error: " + err.message);
      });
    });
    stream.on("end", callback);
  },
});
server.listen(2525,'0.0.0.0');

const SMTPServer = require("smtp-server").SMTPServer;
const simpleParser = require('mailparser').simpleParser;
require('dotenv').config()
const { Telegraf } = require('telegraf')
const { message } = require('telegraf/filters')

const bot = new Telegraf(process.env.BOT_TOKEN)
let telegram = bot.telegram;

chat_id = process.env.CHAT_ID;
port = process.env.PORT;
logger = process.env.LOGGER;

const server = new SMTPServer({
  authOptional: true,
  logger: 0,
  onData(stream, session, callback) {
    simpleParser(stream).then(mail => {

      let mail_from = mail.from.text;
      let mail_to = mail.to.text;
      let mail_subject = mail.subject;

      if (mail.text != undefined) {
        mail_text = mail.text;
      } else {
        mail_text = mail.html;
      }

      telegram.sendMessage(chat_id, mail_from + ' ' + mail_to + ' ' + mail_subject + ' ' + mail_text);

    });
    stream.on("end", callback);
  },
});
server.listen(2525);

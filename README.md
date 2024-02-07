# SMTPGRAM

`smtpgram` is a small SMTP listener and sends
all incoming Email messages to Telegram.

## Getting started

1. Create a new Telegram bot: https://core.telegram.org/bots#creating-a-new-bot.
2. Open that bot account in the Telegram account which should receive
   the messages, press `/start`.
3. Retrieve a chat id with `curl https://api.telegram.org/bot<BOT_TOKEN>/getUpdates`.
4. Repeat steps 2 and 3 for each Telegram account which should receive the messages.
5. Start a docker container:

Assuming that your Email-sending software is running in docker as well,
you may use `<HOST>:<POST>` as the target SMTP address.
No TLS or authentication is required.

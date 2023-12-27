from maubot import Plugin, MessageEvent
from maubot.handlers import command

# import RPi.GPIO as GPIO
import subprocess
import time
import requests


BEER_ALIASES = [
  'cervesa',   # catalan
  'cerveza',   # spanish
  'bier',   # de_DE
  'schoppen',   # de_SILLY
  'hopfenkaltschale', 
  'gerstensaft',
  'bölkstoff',
  'molle',
  'пиво',
  'piwo',
  'pivo',
  'bière',
  'øl',  # dk & no
  'olut',   # fi
  'öl',   # sv

]

class BeerBot(Plugin):
  @command.new()
  async def stalebeer(self, evt: MessageEvent) -> None:
    await evt.reply("more beer please!!")
    gpio21 = "/sys/class/gpio/gpio21/value"
    subprocess.run(["/bin/sh", "-c", "echo 1 > " + gpio21])
    time.sleep(18)
    subprocess.run(["/bin/sh", "-c", "echo 0 > " + gpio21])


    # os.system("/home/candle/beertap/pour.sh")
  @command.new(aliases=BEER_ALIASES)
  async def beer(self, evt: MessageEvent) -> None:
    url = "http://127.0.0.1:5000/setEmoji"
    data = {"emoji":"🍺"}
    r = requests.post (url, json = data)
    response = r.json()
    if response.get("success"):
      await evt.reply("find the 🍺 on the screen")
    else: 
      await evt.reply("bar is closed or the barbot is drunk")

    # find the username and safe the use name as order person for 1 minute
    # after 1 minute empty the order 

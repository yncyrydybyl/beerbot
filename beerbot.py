from maubot import Plugin, MessageEvent
from maubot.handlers import command

# import RPi.GPIO as GPIO
import subprocess
import time

class BeerBot(Plugin):
  @command.new()
  async def beer(self, evt: MessageEvent) -> None:
    await evt.reply("more beer please!!")
    gpio21 = "/sys/class/gpio/gpio21/value"
    subprocess.run(["/bin/sh", "-c", "echo 1 > " + gpio21])
    time.sleep(18)
    subprocess.run(["/bin/sh", "-c", "echo 0 > " + gpio21])
  

    # os.system("/home/candle/beertap/pour.sh")
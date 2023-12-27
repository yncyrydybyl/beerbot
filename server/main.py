import time
import threading

try:
    import RPi.GPIO as GPIO
except RuntimeError:
    print('ERROR: importing RPi.GPIO! This is probably because you need superuser privileges.')

from flask import Flask, render_template, request, jsonify


# Clean up any dirty state
GPIO.cleanup()

# GPIO Setup
GPIO_PIN = 40
POUR_TIME = 18
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BOARD)
GPIO.setup(GPIO_PIN, GPIO.OUT, initial = GPIO.LOW)

app = Flask(__name__)


# An emoji that a user needs to enter.
selectedEmoji = None


@app.route('/')
def home():
    # Show some introduction to the beer bot.
    return render_template('index.html')


@app.route('/getEmoji', methods=["GET"])
def show_grid():
    global selectedEmoji

    if selectedEmoji is not None:
        # base64 encode the emoji so that it doesn't get corrupted in transit
        # TODO: Or just put in body?
        #base64EncodedEmoji = base64.b64encode(selectedEmoji)

        # Return the selected emoji.
        response = jsonify({'emoji': selectedEmoji})

        # Clear the selected emoji.
        selectedEmoji = None

        return response

    return jsonify({})


@app.route('/setEmoji', methods=["POST"])
def showGrid():
    global selectedEmoji

    # Retrieve the given emoji from the request argument 'e'
    data = request.get_json()

    if data is None:
        return jsonify({"error": "must supply an emoji"}), 400
    
    # Set the global variable to the selected emoji
    selectedEmoji = data["emoji"]

    # Show some introduction to the beer bot.
    return jsonify({"success": True})


@app.route('/pour', methods=["POST"])
def pour():
    # Start pouring beer on another thread
    # (that can be paused while beer is pouring).
    thread = threading.Thread(target=pour_beer)
    thread.start()

    # Return a success response in the meantime.
    return jsonify({"success": True})

def pour_beer():
    # Start pouring beer!
    GPIO.output(GPIO_PIN, GPIO.HIGH)

    # Wait some amount of time.
    time.sleep(POUR_TIME)

    # Stop pouring beer!
    GPIO.output(GPIO_PIN, GPIO.LOW)
    

if __name__ == '__main__':
    app.run(debug=True)

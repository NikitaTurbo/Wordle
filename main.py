import os
import random
from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

squares = {
    'p': '⬜',
    'y': '🟨',
    'g': '🟩'
}

word = ""
last = []
words = []
history = []
bad_letters = set()
good_letters = set()
pos = ['', '', '', '', '']

@app.route("/")
def main():
    return redirect(url_for("guess"))

@app.route("/think")
def think():
    global pos
    global last
    global words
    global history

    last.clear()
    words.clear()
    history.clear()
    bad_letters.clear()
    good_letters.clear()
    pos = ['', '', '', '', '']
    

    with open(f"{os.path.dirname(__file__)}/dict.txt", "r+", encoding="UTF-8") as f:
        words = f.read().split("\n")
        last.append(random.choice(words))

    return render_template("index.html", type="think", quantity=6, visible="disabled", word=list(last[-1].upper()))

@app.route("/guess")
def guess():
    global word
    global words
    global history

    words.clear()
    history.clear()

    with open(f"{os.path.dirname(__file__)}/dict.txt", "r+", encoding="UTF-8") as f:
        words = f.read().split("\n")
        word = random.choice(words)

    print("guess", word)

    return render_template("index.html", type="guess", quantity=5, visible="enable", word=(' ' * 5))

@app.route("/check", methods=["GET"])
def check():
    global word
    global history
    global squares

    output = ""
    riddle = request.args["riddle"].lower()
    
    for i in range(5):
        if riddle[i] == word[i]:
            output += 'g'
        elif riddle[i] in word:
            output += 'y'
        else:
            output += 'p'

    print(word, output)
    history.append(''.join([squares[i] for i in output]))

    return {"output": output, "history": history, "word": word}

@app.route("/answer", methods=["GET"])
def answer():
    global pos
    global last
    global history
    global bad_letters
    global good_letters

    output = request.args["output"]
    history.append(''.join([squares[i] for i in output]))

    random.shuffle(words)

    for i in range(5):
        if output[i] == 'g':
            pos[i] = last[-1][i]
        elif output[i] == 'y':
            good_letters.add(last[-1][i])
        else:
            bad_letters.add(last[-1][i])

    print(output, pos, good_letters, bad_letters)
    print(*history, sep="\n")

    for word in words:
        if word not in last:
            if len(good_letters & set(word)) == len(good_letters) and len(bad_letters & set(word)) == 0 and sum([1 for i in range(5) if pos[i] == word[i]]) == sum([1 for i in pos if i != '']):
                last.append(word)
                return {"word": word.upper(), "history": history, "output": output}

    return {"word": last[-1].upper(), "history": history, "output": output}


if __name__ == "__main__":
    app.run(debug=True)

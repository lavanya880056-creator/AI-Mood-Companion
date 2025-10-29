from flask import Flask, render_template, jsonify
import random

app = Flask(__name__)

mood_store = {
    "Happy": {
        "quotes": [
            "Joy finds you when you give it a chance.",
            "Keep shining — your light reaches people you’ll never meet.",
            "Savor this moment; it’s a bright page in your story.",
            "Little pleasures make big memories — cherish them."
        ],
        "tips": [
            "Share your smile with someone — it spreads.",
            "Take a 3-minute dance break to your favorite song.",
            "Write one thing you’re grateful for right now.",
            "Step outside for 2 minutes of sunlight."
        ]
    },
    "Sad": {
        "quotes": [
            "It’s okay to rest — healing doesn’t rush.",
            "Tears are a way the heart lets out what words can’t hold.",
            "Even storms pass; the ground becomes softer afterward.",
            "Feelings are visitors — let them come and go."
        ],
        "tips": [
            "Sip warm water slowly and breathe deeply.",
            "Write one sentence about how you feel, no edits.",
            "Wrap yourself in a soft blanket and sit quietly for 5 minutes.",
            "Call a friend who comforts you; a voice helps."
        ]
    },
    "Angry": {
        "quotes": [
            "Anger is natural — how you handle it is your strength.",
            "Pause. Breathe. Choose peace over impulse.",
            "You can channel heat into creation instead of destruction.",
            "Let the flame teach, not burn you."
        ],
        "tips": [
            "Take 10 deep breaths, counting slowly.",
            "Do a quick physical release — push-ups, jumps, or a brisk walk.",
            "Write what made you angry, then set the paper aside.",
            "Drink cold water and focus on calming your shoulders."
        ]
    },
    "Anxious": {
        "quotes": [
            "You are not your anxious thoughts — you are the calm watching them.",
            "Small steps are still steps forward.",
            "One gentle breath can steady a thousand worries.",
            "You are here. You are safe in this moment."
        ],
        "tips": [
            "Try 5-4-3-2-1 grounding: name things you sense.",
            "Place your hand on your chest and breathe slowly for 1 minute.",
            "Stretch slowly focusing on sensation in your body.",
            "Play soft, slow music and follow its rhythm with your breath."
        ]
    },
    "Calm": {
        "quotes": [
            "Peace grows when you sit with what is and breathe.",
            "Calm is quiet strength — cultivate it gently.",
            "Stillness reveals what the heart already knows.",
            "Anchor yourself in this quiet; it is powerful."
        ],
        "tips": [
            "Close eyes for two minutes and watch your breathing.",
            "Sip a warm drink slowly and feel its warmth.",
            "Stretch from fingertips to toes, slowly and kindly.",
            "Notice three soft things in your environment right now."
        ]
    }
}

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/get_content/<mood>')
def get_content(mood):
    mood = mood.capitalize()
    if mood not in mood_store:
        return jsonify({"error":"mood not found"}), 404
    bucket = mood_store[mood]
    quote = random.choice(bucket["quotes"])
    tips = random.sample(bucket["tips"], 3)
    return jsonify({"quote": quote, "tips": tips, "mood": mood})

if __name__ == '__main__':
    app.run(debug=True)

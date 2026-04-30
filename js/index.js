const words = [
    "the", "be", "of", "and", "a", "to", "in", "he", "have", "it",
    "that", "for", "they", "with", "as", "not", "on", "she", "at", "by",
    "this", "we", "you", "do", "but", "from", "or", "which", "one", "would",
    "all", "will", "there", "say", "who", "make", "when", "can", "more", "if",
    "no", "man", "out", "other", "so", "what", "time", "up", "go", "about",
    "than", "into", "could", "state", "only", "new", "year", "some", "take", "come",
    "these", "know", "see", "use", "get", "like", "then", "first", "any", "work",
    "now", "may", "such", "give", "over", "think", "most", "even", "find", "day",
    "also", "after", "way", "many", "must", "look", "before", "great", "back", "through",
    "long", "where", "much", "should", "well", "people", "down", "own", "just", "because",
    "good", "each", "those", "feel", "seem", "how", "high", "too", "place", "little",
    "world", "very", "still", "nation", "hand", "old", "life", "tell", "write", "become",
    "here", "show", "house", "both", "between", "need", "mean", "call", "develop", "under",
    "last", "right", "move", "thing", "general", "school", "never", "same", "another", "begin",
    "while", "number", "part", "turn", "real", "leave", "might", "want", "point", "form",
    "off", "child", "few", "small", "since", "against", "ask", "late", "home", "interest",
    "large", "person", "end", "open", "public", "follow", "during", "present", "without", "again",
    "hold", "govern", "around", "possible", "head", "consider", "word", "program", "problem", "however",
    "lead", "system", "set", "order", "eye", "plan", "run", "keep", "face", "fact",
    "group", "play", "stand", "increase", "early", "course", "change", "help", "line", "city"
];

const inputArea = document.getElementById("input-area");
const wordString = document.getElementById("word-string");
const scoreText = document.getElementById("score-text");
const timeLeftText = document.getElementById("time-left-text");
const finalScore = document.getElementById("final-score");
const finalScoreText = document.getElementById("final-score-text");

const duration = 10000;
const end = Date.now() + duration;

let score = 0;
let timeOver = false;

function getTimeLeft() {
    return Math.max(0, Math.ceil((end - Date.now()) / 1000));
}

let interval = window.setInterval(() => {
    timeLeftText.innerText = getTimeLeft();
}, 1000);

window.setTimeout(() => {
    timeOver = true;
    clearInterval(interval);
    inputArea.disabled = true;
    finalScoreText.innerText = score;
}, duration);

window.addEventListener("load", 
    (e) => {
        wordString.innerText = words[Math.floor(Math.random() * words.length)];
    }
);

inputArea.addEventListener("keyup",
    (e) => {
        if (!timeOver) {
            let word = wordString.innerText;
            if (inputArea.value === word) {
                wordString.innerText = words[Math.floor(Math.random() * words.length)];
                inputArea.value = "";
                score++;
                scoreText.innerText = score;
            }
        } else {
            if (e.key == 'Enter') {
                
            }
        }
    }
);
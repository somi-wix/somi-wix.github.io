const difficulties = {
    easy: {
        time: 10,
        words: [
            "the", "be", "of", "and", "a", "to", "in", "he", "have", "it",
            "that", "for", "they", "with", "as", "not", "on", "she", "at", "by",
            "this", "we", "you", "do", "but", "from", "or", "one", "all", "will",
            "say", "who", "make", "when", "can", "more", "if", "no", "man", "out",
            "so", "what", "time", "up", "go", "than", "into", "only", "new", "year",
            "some", "take", "come", "know", "see", "use", "get", "like", "then", "any",
            "work", "now", "may", "such", "give", "over", "most", "even", "find", "day",
            "also", "way", "many", "must", "look", "back", "long", "much", "well", "down",
            "own", "just", "good", "each", "feel", "seem", "how", "high", "too", "very",
            "hand", "old", "life", "tell", "here", "show", "both", "need", "mean", "call",
            "last", "move", "same", "part", "turn", "real", "want", "form", "off", "few",
            "ask", "late", "home", "end", "open", "hold", "head", "word", "lead", "set",
            "eye", "plan", "run", "keep", "face", "fact", "play", "help", "line", "city"
        ]
    },
    medium: {
        time: 20, words: [
            "which", "would", "there", "other", "about", "could", "state", "these",
            "first", "think", "after", "great", "where", "people", "those", "place",
            "little", "world", "still", "write", "house", "under", "right", "thing",
            "school", "never", "begin", "while", "number", "leave", "might", "point",
            "child", "small", "since", "large", "person", "public", "follow", "during",
            "again", "around", "order", "group", "stand", "early", "course", "change"
        ]
    },
    hard: {
        time: 30, words: [
            "before", "through", "should", "because", "nation", "become", "between",
            "develop", "general", "another", "against", "interest", "present", "without",
            "govern", "possible", "consider", "program", "problem", "however", "system",
            "increase"
        ]
    }
};

const words = difficulties.easy.words;
const duration = difficulties.easy.time * 1000;

const inputArea = document.getElementById("input-area");
const wordString = document.getElementById("word-string");
const scoreText = document.getElementById("score-text");
const timeLeftText = document.getElementById("time-left-text");
const charsText = document.getElementById("charps-text");
const finalScore = document.getElementById("final-score");
const finalScoreText = document.getElementById("final-score-text");
const leaderBoardTable = document.getElementById("leaderboard");

let score = 0;
let timeOver = false;
let keystrokes = 0;
let timeElapsed = 0;
let start = 0;
let highestCharsPs = 0;
let sessionId = 0;

function getTimeLeft(end) {
    return Math.max(0, Math.ceil((end - Date.now()) / 1000));
}

function randomWord(words) {
    return words[Math.floor(Math.random() * words.length)]
}

function renderLeaderBoard() {
    leaderBoardTable.innerHTML = "<tr><th>Session ID</th><th>Score</th><th>Highest Keystrokes per Second</th></tr>";

    // Populate the table from local storage
    let leaderBoardScores = localStorage.leaderBoard.split(";");
    for (i = 0; i < leaderBoardScores.length; i++) {
        let scoreRow = leaderBoardScores[i];
        let values = scoreRow.split(",");
        if (values.length != 3) {
            continue;
        }
        let row = leaderBoardTable.insertRow(-1);
        let sessionIdCell = row.insertCell(0);
        sessionIdCell.innerHTML = values[0];
        let scoreCell = row.insertCell(1);
        scoreCell.innerHTML = values[1];
        let highestCharsPerSecond = row.insertCell(2);
        highestCharsPerSecond.innerHTML = values[2];
    }
}

function clearLeaderBoard() {
    localStorage.setItem("leaderBoard", "");
    renderLeaderBoard();
    highestCharsPs = 0;
    score = 0;
}

function init() {
    sessionId++;
    // Reset all values
    score = 0;
    timeOver = false;
    keystrokes = 0;
    timeElapsed = 0;
    highestCharsPs = 0;

    start = Date.now();

    // Final score is not shown during the game
    finalScore.hidden = true;

    // On init, enable the input, empty it and focus to it
    inputArea.disabled = false;
    inputArea.value = "";
    inputArea.focus();

    // Choose a random word
    wordString.innerText = randomWord(words);

    // Reset the keystrokes span
    charsText.innerText = 0;

    renderLeaderBoard();

    let end = Date.now() + duration;

    // Every millisecond it will update the time, but the changes
    // will only show up every second because the ceiling of the 
    // time difference till the end in seconds is shown
    let interval = window.setInterval(() => {
        timeLeftText.innerText = getTimeLeft(end);
        timeElapsed++;
    }, 1);

    // Set a timeout for game over
    window.setTimeout(() => {
        // Mark game over
        timeOver = true;

        // Disable the input. Unless you press enter, game is over
        inputArea.disabled = true;

        // Update the final score, and make it visible
        finalScoreText.innerText = score;
        finalScore.hidden = false;

        localStorage.setItem("leaderBoard", localStorage.getItem("leaderBoard") + `${sessionId},${score},${highestCharsPs};`);
        renderLeaderBoard();
        // Clear the interval object
        clearInterval(interval);
    }, duration);
}

window.addEventListener("keyup",
    (e) => {
        // If time is over and user presses 'Enter', restart the game
        if (timeOver && e.key === 'Enter') {
            init();
        }
    }
);

window.addEventListener("load",
    () => {
        // On load, init the game
        init();
    }
);

inputArea.addEventListener("keyup",
    (e) => {
        if (!timeOver) {
            // Update keystrokes
            keystrokes++;
            let word = wordString.innerText;
            // Match the word
            if (inputArea.value === word) {
                // Choose the next word
                wordString.innerText = randomWord(words);
                // Record characters per second
                let charsPs = (keystrokes / (Date.now() - start) * 1000).toFixed(2);
                charsText.innerText = charsPs;

                if (charsPs > highestCharsPs) {
                    highestCharsPs = charsPs;
                }

                // Reset the input area
                inputArea.value = "";
                // Update the score
                score++;
                scoreText.innerText = score;
            }
        }
    }
);
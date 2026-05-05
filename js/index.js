const difficulties = {
    "easy": {
        name: "Easy",
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
    "medium": {
        name: "Medium",
        time: 20, words: [
            "which", "would", "there", "other", "about", "could", "state", "these",
            "first", "think", "after", "great", "where", "people", "those", "place",
            "little", "world", "still", "write", "house", "under", "right", "thing",
            "school", "never", "begin", "while", "number", "leave", "might", "point",
            "child", "small", "since", "large", "person", "public", "follow", "during",
            "again", "around", "order", "group", "stand", "early", "course", "change"
        ]
    },
    "hard": {
        name: "Hard",
        time: 30, words: [
            "before", "through", "should", "because", "nation", "become", "between",
            "develop", "general", "another", "against", "interest", "present", "without",
            "govern", "possible", "consider", "program", "problem", "however", "system",
            "increase"
        ]
    },
    "very_hard": {
        name: "Very Hard",
        time: 45, words: [
            "acknowledge", "bureaucracy", "conscientious", "deteriorate", "entrepreneur",
            "facilitate", "gregarious", "hypothetical", "idiosyncrasy", "juxtaposition",
            "knowledgeable", "legitimate", "miscellaneous", "nevertheless", "ostentatious",
            "perseverance", "quintessential", "reminiscence", "simultaneously", "transcendental",
            "unprecedented", "vicissitude", "whimsical", "xenophobia", "yearning",
            "zealousness", "ambivalent", "benevolent", "cacophony", "diligent",
            "ephemeral", "fastidious", "garrulous", "harbinger", "indelible"
        ]
    },
    "insane": {
        name: "Insane",
        time: 60, words: [
            "antidisestablishmentarianism", "pneumonoultramicroscopicsilicovolcanoconiosis",
            "floccinaucinihilipilification", "supercalifragilisticexpialidocious",
            "pseudopseudohypoparathyroidism", "thyroparathyroidectomized",
            "incomprehensibilities", "uncharacteristically", "counterrevolutionaries",
            "deinstitutionalization", "electroencephalographically", "interdenominational",
            "compartmentalization", "disproportionately", "overintellectualization",
            "psychophysiological", "ultraconservatively", "unconstitutionally",
            "indistinguishability", "transubstantiation", "phosphatidylcholine",
            "hexakosioihexekontahexaphobia", "hippopotomonstrosesquippedaliophobia",
            "otorhinolaryngological", "magnetohydrodynamics", "spectrophotometrically",
            "thermoluminescence", "anthropomorphization", "neuroendocrinological",
            "psychoneuroimmunology"
        ]
    }
};

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
let timeOut;
let interval;
let words;
let duration;

function getTimeLeft(end) {
    return Math.max(0, Math.ceil((end - Date.now()) / 1000));
}

function randomWord(words) {
    return words[Math.floor(Math.random() * words.length)]
}

function renderLeaderBoard() {
    leaderBoardTable.innerHTML = "<tr><th>Date</th><th>Time</th><th>Difficulty</th><th>Score</th><th>Highest Keystrokes per Second</th></tr>";

    // Populate the table from local storage
    let leaderBoardScores = localStorage.leaderBoard.split(";");
    for (i = 0; i < leaderBoardScores.length; i++) {
        let scoreRow = leaderBoardScores[i];
        let values = scoreRow.split(",");
        if (values.length != 5) {
            continue;
        }
        let row = leaderBoardTable.insertRow(-1);
        let dateCell = row.insertCell(-1);
        dateCell.innerHTML = values[0].trim();
        let timeCell = row.insertCell(-1);
        timeCell.innerHTML = values[1].trim();
        let diffCell = row.insertCell(-1);
        diffCell.innerHTML = values[2].trim();
        let scoreCell = row.insertCell(-1);
        scoreCell.innerHTML = values[3];
        let highestCharsPerSecond = row.insertCell(-1);
        highestCharsPerSecond.innerHTML = values[4];
    }
}

function clearLeaderBoard() {
    localStorage.setItem("leaderBoard", "");
    renderLeaderBoard();
    highestCharsPs = 0;
    score = 0;
}

function init(difficulty) {
    clearTimeout(timeOut);
    clearInterval(interval);

    if (localStorage.leaderBoard == null) {
        localStorage.leaderBoard = "";
    }

    words = difficulties[difficulty].words;
    duration = difficulties[difficulty].time * 1000;
    difficultyName = difficulties[difficulty].name;
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
    interval = window.setInterval(() => {
        timeLeftText.innerText = getTimeLeft(end);
        timeElapsed++;
    }, 1);

    // Set a timeout for game over
    timeOut = window.setTimeout(() => {
        // Mark game over
        timeOver = true;

        // Disable the input. Unless you press enter, game is over
        inputArea.disabled = true;

        // Update the final score, and make it visible
        finalScoreText.innerText = score;
        finalScore.hidden = false;

        localStorage.setItem("leaderBoard", 
            localStorage.getItem("leaderBoard") + `${new Date().toLocaleString()},${difficultyName},${score},${highestCharsPs};`);
        renderLeaderBoard();
        // Clear the interval object
        clearInterval(interval);
    }, duration);
}

window.addEventListener("keyup",
    (e) => {
        // If time is over and user presses 'Enter', restart the game
        if (timeOver && e.key === 'Enter') {
            init(document.getElementById("difficulty-dropdown").value);
        }
    }
);

window.addEventListener("load",
    () => {
        // On load, init the game
        init(document.getElementById("difficulty-dropdown").value);
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
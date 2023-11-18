let num1, num2;

let problemsSolved = 0;
let currentStreak = 0;
let longestStreak = 0;

function generateProblem() {
    num2 = Math.floor(Math.random() * 50) + 50; // 50 to 99
    num1 = Math.floor(Math.random() * (199 - num2)) + (100 - num2); // ensures sum between 100 and 199

    // Split the numbers into digits and display them
    displayNumber(num1, 'number1-digit');
    displayNumber(num2, 'number2-digit');
}

function displayNumber(number, elementIdPrefix) {
    let digits = number.toString().padStart(3, ' ').split('');
    for (let i = 0; i < 3; i++) {
        document.getElementById(`${elementIdPrefix}${i+1}`).textContent = digits[i];
    }
}

function updateScores(isCorrect) {
    if (isCorrect) {
        problemsSolved++;
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
    } else {
        currentStreak = 0;
    }

    document.getElementById("problems-solved").textContent = problemsSolved;
    document.getElementById("current-streak").textContent = currentStreak;
    document.getElementById("longest-streak").textContent = longestStreak;
}

function setupInputFocus() {
    // Initially, only the one's digit answer box is enabled
    let answerOnes = document.getElementById("answer-ones");
    answerOnes.disabled = false;
    answerOnes.focus();

    // Set up input focus and validation sequence
    setupNextInput("answer-ones", "carry-tens", false);
    setupNextInput("carry-tens", "answer-tens", true);
    setupNextInput("answer-tens", "carry-hundreds", false);
    setupNextInput("carry-hundreds", "answer-hundreds", true);
    setupNextInput("answer-hundreds", null, false);
}

function setupNextInput(currentId, nextId, isCarry) {
    let currentInput = document.getElementById(currentId);
    let nextInput = document.getElementById(nextId);

    currentInput.addEventListener('input', function() {
        if ((isCarry && (this.value === "0" || this.value === "1")) || (!isCarry && this.value.length === 1)) {
            if (currentId === "answer-hundreds") {
                // If the current input is the last in the sequence, focus on the check answer button
                document.getElementById("check-answer-btn").focus();
            } else {
                // Otherwise, proceed to the next input
                nextInput.disabled = false;
                nextInput.focus();
            }
        }
    });
}

function clearBox(input) {
    input.value = '';
    input.disabled = true;
}

function checkAnswer() {
    let answerInputs = document.querySelectorAll("#answer-boxes .answer-input");

    let answer = 0;

    // Calculate the answer value from the inputs
    answerInputs.forEach((input, index) => {
        answer += (parseInt(input.value) || 0) * Math.pow(10, 2 - index);
    });

    if (answer === num1 + num2) {
        document.getElementById("feedback").textContent = "Correct! Here's the next problem.";
        updateScores(true);
        generateProblem();
    } else {
        document.getElementById("feedback").textContent = "Incorrect, try again.";
        updateScores(false);
    }

    // Clear carry and answer input fields after checking the answer
    document.querySelectorAll("#carry-boxes .carry-input").forEach(input => clearBox(input));
    answerInputs.forEach(input => clearBox(input));

    // After checking the answer, reset the input setup
    setupInputFocus();
}


generateProblem(); // Initialize the first problem
setupInputFocus(); // Set up input focus management

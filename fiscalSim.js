let scenarios = [];
let used = new Set();
let selectedButton = null;
let current = null;
let score = 0;
let qNumber = 0;

// -----------------------------------------
// BUILD ALL 30 SCENARIOS
// -----------------------------------------
function buildScenarios() {

    // TAX & SPENDING (20)
    const taxSpending = [

        // SPENDING (10)
        { text:"The government launches a nationwide project to rebuild highways.", answer:"spending", type:"policy" },
        { text:"Congress approves funding to modernize school buildings.", answer:"spending", type:"policy" },
        { text:"The government increases grants for public transportation improvements.", answer:"spending", type:"policy" },
        { text:"The government extends unemployment benefits.", answer:"spending", type:"policy" },
        { text:"Congress increases military spending.", answer:"spending", type:"policy" },
        { text:"The government boosts disaster relief funding.", answer:"spending", type:"policy" },
        { text:"The government provides subsidies to farmers.", answer:"spending", type:"policy" },
        { text:"Congress expands Social Security and Medicare funding.", answer:"spending", type:"policy" },
        { text:"The government funds new VA hospitals.", answer:"spending", type:"policy" },
        { text:"The government increases funding for national parks.", answer:"spending", type:"policy" },

        // TAX (10)
        { text:"The government raises taxes on gasoline consumption.", answer:"tax", type:"policy" },
        { text:"Congress lowers income tax rates for middle-income families.", answer:"tax", type:"policy" },
        { text:"The government increases deductions for households with college students.", answer:"tax", type:"policy" },
        { text:"Congress creates new tax credits for first-time homebuyers.", answer:"tax", type:"policy" },
        { text:"The government raises corporate tax rates.", answer:"tax", type:"policy" },
        { text:"Congress eliminates certain tax credits to reduce the deficit.", answer:"tax", type:"policy" },
        { text:"The government increases taxes on luxury goods.", answer:"tax", type:"policy" },
        { text:"Congress decreases payroll taxes.", answer:"tax", type:"policy" },
        { text:"The government creates deductions for renewable energy installation.", answer:"tax", type:"policy" },
        { text:"Congress raises excise taxes on alcohol and tobacco.", answer:"tax", type:"policy" }
    ];

    // GROWTH EFFECT (8)
    const growth = [
        { text:"The government decreases taxes and increases spending.", answer:"encourage", type:"growth" },
        { text:"Congress raises taxes and reduces federal spending.", answer:"slow", type:"growth" },
        { text:"Congress cuts taxes and increases unemployment benefits.", answer:"encourage", type:"growth" },
        { text:"The government increases spending but keeps taxes the same.", answer:"encourage", type:"growth" },
        { text:"Congress reduces spending while keeping taxes the same.", answer:"slow", type:"growth" },
        { text:"The government raises taxes while keeping spending the same.", answer:"slow", type:"growth" },

        // ✔️ FIXED CONTRADICTION — NEW SCENARIO
        { text:"Congress cuts several spending programs while leaving taxes unchanged.", answer:"slow", type:"growth" },

        { text:"The government lowers taxes but keeps spending unchanged.", answer:"encourage", type:"growth" }
    ];

    // NO CHANGE (2)
    const noChange = [
        { text:"The government keeps both taxes and spending at current levels.", answer:"none", type:"policy" },
        { text:"Congress decides not to change taxes or spending this year.", answer:"none", type:"policy" }
    ];

    scenarios = [...taxSpending, ...growth, ...noChange];
}

// -----------------------------------------
// START GAME
// -----------------------------------------
document.getElementById("startBtn").onclick = () => {
    const name = document.getElementById("studentName").value.trim();
    if (!name) return;

    document.getElementById("displayName").textContent = name;
    document.getElementById("dateStamp").textContent = new Date().toLocaleString();

    document.getElementById("nameContainer").classList.add("hidden");
    document.getElementById("scoreboard").classList.remove("hidden");
    document.getElementById("scenarioBox").classList.remove("hidden");

    buildScenarios();
    loadScenario();
};

// -----------------------------------------
// LOAD NEXT SCENARIO
// -----------------------------------------
function loadScenario() {
    if (qNumber >= 30) return endGame();

    let index;
    do {
        index = Math.floor(Math.random() * scenarios.length);
    } while (used.has(index));

    used.add(index);
    current = scenarios[index];

    qNumber++;
    document.getElementById("questionNumber").textContent = qNumber;
    document.getElementById("scenarioText").textContent = current.text;
    document.getElementById("resultBox").textContent = "";

    resetButtons();
    togglePanels();
}

// -----------------------------------------
// SHOW CORRECT PANEL
// -----------------------------------------
function togglePanels() {
    document.getElementById("policyPanel").classList.add("hidden");
    document.getElementById("growthPanel").classList.add("hidden");

    if (current.type === "policy") {
        document.getElementById("policyPanel").classList.remove("hidden");
    } else {
        document.getElementById("growthPanel").classList.remove("hidden");
    }

    document.getElementById("submitBtn").classList.add("hidden");
}

// -----------------------------------------
// RESET BUTTONS
// -----------------------------------------
function resetButtons() {
    selectedButton = null;

    document.querySelectorAll(".choiceBtn").forEach(btn => {
        btn.disabled = false;
        btn.classList.remove("selected", "correct", "incorrect");

        btn.onclick = () => {
            if (btn.classList.contains("correct")) return;

            if (selectedButton && !selectedButton.classList.contains("correct")) {
                selectedButton.classList.remove("selected");
            }

            selectedButton = btn;
            btn.classList.add("selected");
            document.getElementById("submitBtn").classList.remove("hidden");
        };
    });

    document.getElementById("submitBtn").onclick = submitAnswer;
}

// -----------------------------------------
// SUBMIT ANSWER
// -----------------------------------------
function submitAnswer() {
    if (!selectedButton) return;

    const choice = selectedButton.getAttribute("data-answer");

    if (choice === current.answer) {

        selectedButton.classList.add("correct");
        score++;
        document.getElementById("score").textContent = score;

        disableButtons();

        document.getElementById("resultBox").textContent = "Correct!";
        document.getElementById("resultBox").style.color = "green";

        setTimeout(loadScenario, 900);

    } else {
        selectedButton.classList.add("incorrect");
        document.getElementById("resultBox").textContent = "Incorrect — Try again";
        document.getElementById("resultBox").style.color = "red";
    }
}

// -----------------------------------------
// DISABLE BUTTONS
// -----------------------------------------
function disableButtons() {
    document.querySelectorAll(".choiceBtn").forEach(btn => btn.disabled = true);
}

// -----------------------------------------
// END GAME
// -----------------------------------------
function endGame() {
    document.getElementById("scenarioBox").classList.add("hidden");
    document.getElementById("policyPanel").classList.add("hidden");
    document.getElementById("growthPanel").classList.add("hidden");
    document.getElementById("endScreen").classList.remove("hidden");

    document.getElementById("finalScore").textContent = score;
}

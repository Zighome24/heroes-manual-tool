const url = 'http://127.0.0.1:5000/quizzes-json' //modify this if you change the server
var quizzes = [];

var current_quiz = null;

const numberCol = document.querySelector("#number-col .list-layout");
const listCol = document.querySelector("#list-col .list-layout");

async function getJSON() {
    const response = await fetch(url, {
        method: 'GET',
        mode: 'same-origin'
    });
    return await response.json()
}

async function save() {
    const response = await fetch(url, {
        method: 'POST',
        mode: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "quizzes": quizzes
        })
    });

    return await response.json();
}

function clearQuestionInfo() {
    console.log("Clear Card info");
    const questionTxt = document.getElementById("txt_question");
    const infoTxt = document.getElementById("txt_info");
    const radioMC = document.getElementById("radio_mc");
    const radioF = document.getElementById("radio_f");
    const correctTxt = document.getElementById("txt_correct");
    // clear text, hide mc and f
    questionTxt.value = "";
    infoTxt.value = "";
    radioMC.checked = false;
    radioF.checked = false;
    correctTxt.value = false;

    questionTxt.onchange = null;
    infoTxt.onchange = null;
    radioMC.onclick = null;
    radioF.onclick = null;
    correctTxt.onchange = null;

    document.getElementById("mc").classList.add("hidden");
    document.getElementById("f").classList.add("hidden");
}

function addMCStuff(question) {
    const rCh1 = document.getElementById("choice1");
    const tCh1 = document.getElementById("txt_choice1");
    const rCh2 = document.getElementById("choice2");
    const tCh2 = document.getElementById("txt_choice2");
    const rCh3 = document.getElementById("choice3");
    const tCh3 = document.getElementById("txt_choice3");
    const rCh4 = document.getElementById("choice4");
    const tCh4 = document.getElementById("txt_choice4");

    tCh1.value = question["options"][0];
    rCh1.checked = (question["options"][0] == question["correct"]);

    tCh2.value = question["options"][1];
    rCh2.checked = (question["options"][1] == question["correct"]);

    tCh3.value = question["options"][2];
    rCh3.checked = (question["options"][2] == question["correct"]);

    tCh4.value = question["options"][3];
    rCh4.checked = (question["options"][3] == question["correct"]);
    
    rCh1.onclick = function() {
        question["correct"] = tCh1.value;
        save();
    };
    tCh1.onchange = function(e) {
        question["options"][0] = e.target.value;
        save();
    }

    rCh2.onclick = function() {
        question["correct"] = tCh2.value;
        save();
    };
    tCh2.onchange = function(e) {
        question["options"][1] = e.target.value;
        save();
    }

    rCh3.onclick = function() {
        question["correct"] = tCh3.value;
        save();
    };
    tCh3.onchange = function(e) {
        question["options"][2] = e.target.value;
        save();
    }

    rCh4.onclick = function() {
        question["correct"] = tCh4.value;
        save();
    };
    tCh4.onchange = function(e) {
        question["options"][3] = e.target.value;
        save();
    }
}

function resetQuestionInfo(element, question) {
    const temp = document.querySelector("#number-col .selected");
    if (temp != null) { temp.classList.remove("selected"); }
    //set selected
    element.classList.add("selected");
    // set text box things
    const questionTxt = document.getElementById("txt_question");
    const infoTxt = document.getElementById("txt_info");
    const radioMC = document.getElementById("radio_mc");
    const radioF = document.getElementById("radio_f");
    const correctTxt = document.getElementById("txt_correct");
    questionTxt.value = question["text"];
    infoTxt.value = question["info"];
    correctTxt.value = question["correct"];
    questionTxt.onchange = function(e) {
        question["text"] = e.target.value;
        save();
    };
    infoTxt.onchange = function(e) {
        question["info"] = e.target.value;
        save();
    };
    correctTxt.onchange = function(e) {
        question["correct"] = e.target.value;
        save();
    };

    addMCStuff(question);

    switch (question["type"]) {
        case "mc":
            radioMC.checked = true;
            radioF.checked = false;
            document.getElementById("mc").classList.remove("hidden");
            document.getElementById("f").classList.add("hidden");
            break;
        case "f":
            radioMC.checked = false;
            radioF.checked = true;
            document.getElementById("mc").classList.add("hidden");
            document.getElementById("f").classList.remove("hidden");
            break;
    }
    radioF.onclick = function() {
        document.getElementById("mc").classList.add("hidden");
        document.getElementById("f").classList.remove("hidden");
        question["type"] = "f";
        if (question["correct"] != correctTxt.value) {
            question["correct"] = correctTxt.value;
        }
        save();
    };
    radioMC.onclick = function() {
        document.getElementById("mc").classList.remove("hidden");
        document.getElementById("f").classList.add("hidden");
        question["type"] = "mc";
        if (!question["options"].includes(question["correct"])) {
            question["correct"] = question["options"][0];
            document.getElementById("choice1").checked = true;
        }
        save();
    };
    save();
}

//------- TODO ---------------
// handle mc vs. f on page, add sources to overall in training
// add listeners for all, check server side
// modify heroes-manual to match new sources position

function createQuestionElement(question, title, index) {
    // name div
    const name = document.createElement("div");
    name.classList.add("name");
    name.innerText = index;
    // delete button
    const deleteBtn = document.createElement("div");
    deleteBtn.classList.add("del-btn");
    deleteBtn.innerText = "X";
    deleteBtn.onclick = function() {
        if (confirm(`Are you sure you want to delete question \#${index}`)) {
            element.onclick = null;
            current_quiz["questions"] = current_quiz["questions"].filter((q) => {
                return !(q["text"] == question["text"] && q["type"] == question["type"] && q["correct"] == question["correct"]);
            });
            save();
            numberCol.innerHTML = "";
            current_quiz['questions'].forEach((questionData, index) => {
                createQuestionElement(questionData, current_quiz['title'], index + 1);
            });
            clearQuestionInfo();
        }
    }
    // main element
    const element = document.createElement("div");
    element.classList.add("list-item", "row");
    element.onclick = function() {
        resetQuestionInfo(this, question);
    }
    element.append(name, deleteBtn);
    numberCol.appendChild(element);
    return element;
}

function clearQuizInfo() {
    console.log("Clear Training Info");
    const titleTxt = document.getElementById("txt_title");
    const summaryTxt = document.getElementById("txt_summary");
    const sourcesTxt = document.getElementById("txt_sources");
    titleTxt.value = "";
    summaryTxt.value = "";
    sourcesTxt.value = "";
    titleTxt.onchange = null;
    summaryTxt.onchange = null;
    sourcesTxt.onchange = null;
}

function resetQuizInfo(element, quiz) {
    const temp = document.querySelector("#list-col .selected");
    if (temp != null) { temp.classList.remove("selected"); }
    //set selected
    element.classList.add("selected");
    current_quiz = quiz;
    // set text box things
    const titleTxt = document.getElementById("txt_title");
    const summaryTxt = document.getElementById("txt_summary");
    const sourceTxt = document.getElementById("txt_sources");

    titleTxt.value = quiz['title'];
    summaryTxt.value = quiz['summary'];
    sourceTxt.value = quiz['sources'];

    titleTxt.onchange = function(e) {
        quiz["title"] = e.target.value;
        save();
    };
    summaryTxt.onchange = function(e) {
        quiz["summary"] = e.target.value;
        save();
    };

    sourceTxt.onchange = function(e) {
        quiz["sources"] = e.target.value;
        save();
    }
    // do it for cards
    numberCol.innerHTML = "";
    clearQuestionInfo();
    quiz['questions'].forEach((questionData, index) => {
        createQuestionElement(questionData, quiz['title'], index + 1);
    });
    save();
}

function createQuizElement(quiz) {
    // name div
    const name = document.createElement("div");
    name.classList.add("name");
    name.innerText = quiz["title"];
    // delete button
    const deleteBtn = document.createElement("div");
    deleteBtn.classList.add("del-btn");
    deleteBtn.innerText = "X";
    deleteBtn.onclick = function() {
        if (confirm(`Are you sure you want to delete ${quiz['title']}?`)) {
            element.onclick = null;
            quizzes = quizzes.filter(q => {
                return !(q['title'] == quiz['title'] && q['summary'] == quiz['summary'])
            });
            numberCol.innerHTML = "";
            listCol.innerHTML = "";
            quizzes.forEach((qwiz) => {
                createTrainingElement(qwiz);
            });
            clearQuestionInfo();
            clearQuizInfo();
            save();
        }
    }
    // main element
    const element = document.createElement("div");
    element.classList.add("list-item", "row");
    element.onclick = function() {
        resetQuizInfo(this, quiz);
    }
    element.append(name, deleteBtn);
    listCol.appendChild(element);
    return element;
}

document.getElementById("btn1").onclick = function() {
    const empty_quiz = {
        "title": "Quiz name goes here",
        "questions":
        [
            {
                "text": "Question goes here.",
                "type": "mc",
                "options":
                [
                    "Choice 1",
                    "Choice 2",
                    "Choice 3",
                    "Choice 4"
                ],
                "correct": "Choice 1",
                "info": "This is the explaination of the correct answer."
            }
        ],
        "summary": "Summary of the quiz goes here.",
        "sources": "Sources go here."
    };
    trainings.push(empty_quiz);
    const elem = createTrainingElement(empty_quiz);
    resetTrainingInfo(elem, empty_quiz);
};

document.getElementById("btn2").onclick = function() {
    const empty_question = {
        "text": "Question goes here.",
        "type": "mc",
        "options":
        [
            "Choice 1",
            "Choice 2",
            "Choice 3",
            "Choice 4"
        ],
        "correct": "Choice 1",
        "info": "This is the explaination of the correct answer."
    };
    if (current_quiz != null) {
        current_quiz['questions'].push(empty_question)
        const elem = createQuestionElement(
            empty_question, 
            current_quiz['title'], 
            current_quiz["questions"].length);
        resetCardInfo(elem, empty_question);
    } else {
        alert("You have to select a quiz to add a question!");
    }
};

document.getElementById("btn3").onclick = function() {
    console.log("saved!");
    save();
};

getJSON().then((data) => {
    console.log(data['quizzes']);
    quizzes = data['quizzes'];
    quizzes.forEach((quiz) => {
        createQuizElement(quiz);
    });
});
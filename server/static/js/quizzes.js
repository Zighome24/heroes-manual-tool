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
            "trainings": trainings
        })
    });

    return await response.json();
}

function clearQuestionInfo() {
    console.log("Clear Card info");
    /*
    const cardTxt = document.getElementById("txt_card");
    const sourceTxt = document.getElementById("txt_source");
    cardTxt.value = "";
    sourceTxt.value = "";
    cardTxt.onchange = null;
    sourceTxt.onchange = null;
    */
}

function resetQuestionInfo(element, card) {
    const temp = document.querySelector("#number-col .selected");
    if (temp != null) { temp.classList.remove("selected"); }
    //set selected
    element.classList.add("selected");
    // set text box things
    /*
    const cardTxt = document.getElementById("txt_card");
    const sourceTxt = document.getElementById("txt_source");
    cardTxt.value = card["text"];
    sourceTxt.value = card["source"];
    cardTxt.onchange = function(e) {
        card["text"] = e.target.value;
        save();
    }
    sourceTxt.onchange = function(e) {
        card["source"] = e.target.value;
        save();
    }
    */
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
    /*quizzes.forEach((quiz) => {
        createQuizElement(quiz);
    });*/
});
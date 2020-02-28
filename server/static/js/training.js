const url = 'http://127.0.0.1:5000/training-json' //modify this if you change the server
var trainings = [];

var current_training = null;

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

function resetCardInfo(element, card) {
    const temp = document.querySelector("#number-col .selected");
    if (temp != null) { temp.classList.remove("selected"); }
    //set selected
    element.classList.add("selected");
    // set text box things
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
    save();
}

function clearCardInfo() {
    console.log("Clear Card info");
    const cardTxt = document.getElementById("txt_card");
    const sourceTxt = document.getElementById("txt_source");
    cardTxt.value = "";
    sourceTxt.value = "";
    cardTxt.onchange = null;
    sourceTxt.onchange = null;
}

function createCardElement(card, title, index) {
    // name div
    const name = document.createElement("div");
    name.classList.add("name");
    name.innerText = index;
    // delete button
    const deleteBtn = document.createElement("div");
    deleteBtn.classList.add("del-btn");
    deleteBtn.innerText = "X";
    deleteBtn.onclick = function() {
        if (confirm(`Are you sure you want to delete card \#${index}`)) {
            element.onclick = null;
            current_training["cards"] = current_training["cards"].filter((crd) => {
                return !(crd["text"] == card["text"] && crd["source"] == card["source"]);
            });
            save();
            numberCol.innerHTML = "";
            current_training['cards'].forEach((cardData, index) => {
                createCardElement(cardData, current_training['title'], index + 1);
            });
            clearCardInfo();
        }
    }
    // main element
    const element = document.createElement("div");
    element.classList.add("list-item", "row", "card");
    element.onclick = function() {
        resetCardInfo(this, card);
    }
    element.append(name, deleteBtn);
    numberCol.appendChild(element);
    return element;
}

function removeCards() {
    console.log("remove cards");
    document.querySelectorAll(".card").forEach(element => element.remove());
}

function resetTrainingInfo(element, training) {
    const temp = document.querySelector("#list-col .selected");
    if (temp != null) { temp.classList.remove("selected"); }
    //set selected
    element.classList.add("selected");
    current_training = training;
    // set text box things
    const titleTxt = document.getElementById("txt_title");
    const summaryTxt = document.getElementById("txt_summary");

    titleTxt.value = training['title'];
    summaryTxt.value = training['summary'];

    titleTxt.onchange = function(e) {
        training["title"] = e.target.value;
        save();
    };
    summaryTxt.onchange = function(e) {
        training["summary"] = e.target.value;
        save();
    };
    // do it for cards
    numberCol.innerHTML = "";
    clearCardInfo();
    training['cards'].forEach((cardData, index) => {
        createCardElement(cardData, training['title'], index + 1);
    });
    save();
}

function createTrainingElement(training) {
    // name div
    const name = document.createElement("div");
    name.classList.add("name");
    name.innerText = training["title"];
    // delete button
    const deleteBtn = document.createElement("div");
    deleteBtn.classList.add("del-btn");
    deleteBtn.innerText = "X";
    deleteBtn.onclick = function() {
        if (confirm(`Are you sure you want to delete ${training['title']}?`)) {
            element.onclick = null;
            trainings = trainings.filter(trn => {
                return !(trn['title'] == training['title'] && trn['summary'] == training['summary'])
            });
            numberCol.innerHTML = "";
            listCol.innerHTML = "";
            trainings.forEach((training) => {
                createTrainingElement(training);
            });
            clearCardInfo();
            save();
        }
    }
    // main element
    const element = document.createElement("div");
    element.classList.add("list-item", "row");
    element.onclick = function() {
        resetTrainingInfo(this, training);
    }
    element.append(name, deleteBtn);
    listCol.appendChild(element);
    return element;
}

document.getElementById("btn1").onclick = function() {
    const empty_training = {
        "title": "Training name goes here.",
        "cards":
        [
            {
                "text": "Text goes here",
                "source": "Source goes here"
            }
        ],
        "summary": "Summary goes here."
    };
    trainings.push(empty_training);
    const elem = createTrainingElement(empty_training);
    resetTrainingInfo(elem, empty_training);
};

document.getElementById("btn2").onclick = function() {
    const empty_card = {
        "text": "Text goes here",
        "source": "Source goes here"
    }
    if (current_training != null) {
        current_training['cards'].push(empty_card)
        const elem = createCardElement(
            empty_card, 
            current_training['title'], 
            current_training["cards"].length);
        resetCardInfo(elem, empty_card);
    } else {
        alert("You have to select a training to add a card!");
    }
};

document.getElementById("btn3").onclick = function() {
    console.log("saved!");
    save();
};

getJSON().then((data) => {
    console.log(data['trainings']);
    trainings = data['trainings'];
    trainings.forEach((training) => {
        createTrainingElement(training);
    });
});
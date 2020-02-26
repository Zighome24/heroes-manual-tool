const url = 'http://localhost:5000/training-json' //modify this if you change the server

async function getJSON() {
    const response = await fetch(url, {
        method: 'GET',
        mode: 'same-origin'
    });

    return await response.json()
}

getJSON().then((data) => {
    console.log(data);
});
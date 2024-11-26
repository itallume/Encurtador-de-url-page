const urlInputElement = document.getElementById("urlInput");
let activeDuration = "1";
const durationElements = {
    "1": document.getElementById("one"),
    "2": document.getElementById("two"),
    "5": document.getElementById("five"),
    "10": document.getElementById("ten")
};

function changeDuration(duration) {

    durationElements[activeDuration].classList.remove("selected");
    durationElements[activeDuration].classList.add("unselected");

    activeDuration = duration;
    durationElements[duration].classList.remove("unselected");
    durationElements[duration].classList.add("selected");
}

async function generateShortenerUrl() {
    const originalURL = urlInputElement.value;
    const date = new Date();
    date.setDate(date.getDate() + Number(activeDuration));
    const expirationTimeInSeconds = Math.floor(date.getTime() / 1000).toString();
    const urlData = {
        "originalUrl": originalURL,
        "expirationTime": expirationTimeInSeconds
    }
    getCodeUrl(urlData)
    .then(response => alert(`A sua URL encurtada: https://sjx4g5l0ag.execute-api.us-east-2.amazonaws.com/${response["code"]}`))
}

const getCodeUrl = async (urlData) => {
    const options = {
        method: 'POST',
        body: JSON.stringify(urlData)
    }
    return await fetch('https://sjx4g5l0ag.execute-api.us-east-2.amazonaws.com/create', options)
    .then(r => r.json());
}
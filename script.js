const urlInputElement = document.getElementById("urlInput");
const sidebar = document.getElementById("sidebarURLS");
const menuIcon = document.getElementById("menuIcon");
const arrowHide = document.getElementById("arrowHide");
const urlsList = document.getElementById("urlList");


menuIcon.addEventListener("click", event => {
    sidebar.style.animation = "showSidebar 0.3s ease-out 0s 1 normal forwards running"; 
    urlsList.replaceChildren();
    updateUrlList();
})

function updateUrlList(){
    if(localStorage.length > 0){
        for(i = 0; i < localStorage.length; i++){
            const key = localStorage.key(i);
            const item = JSON.parse(localStorage.getItem(key));
            urlsList.innerHTML += informationComponent(key, item["originalURL"], item["shortenedURL"])
        }
    }
}

arrowHide.addEventListener("click", event => {
    sidebar.style.animation = "hideSidebar 0.3s ease-in 0s 1 normal forwards running"
})

let activeDuration = "1";
const durationElements = {
    "1": document.getElementById("one"),
    "2": document.getElementById("two"),
    "5": document.getElementById("five"),
    "10": document.getElementById("ten")
}

function changeDuration(duration) {

    durationElements[activeDuration].classList.remove("selected");
    durationElements[activeDuration].classList.add("unselected");

    activeDuration = duration;
    durationElements[duration].classList.remove("unselected");
    durationElements[duration].classList.add("selected");
}

const nameInputElement = document.getElementById("nameInput");
const checkbox = document.getElementById("namedUrl");
checkbox.addEventListener("click", event => {
    if(checkbox.checked == true){
        nameInputElement.style.display = "block";
        return
    }
    nameInputElement.style.display = "none";
})

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
    .then(response => {
        alert(`A sua URL encurtada: https://sjx4g5l0ag.execute-api.us-east-2.amazonaws.com/${response["code"]}`);
        if(checkbox.checked == true){
            if(nameInputElement == ""){
                alert("de um nome a sua url")
            }
            const obj = {
                "name": nameInputElement.value,
                "originalURL": originalURL,
                "shortenedURL": `https://sjx4g5l0ag.execute-api.us-east-2.amazonaws.com/${response["code"]}`
            }
            localStorage.setItem(nameInputElement.value, JSON.stringify(obj));
        }
        urlInputElement.value = "";
        nameInputElement.value = "";

    });
}

const getCodeUrl = async (urlData) => {
    const options = {
        method: 'POST',
        body: JSON.stringify(urlData)
    }
    return await fetch('https://sjx4g5l0ag.execute-api.us-east-2.amazonaws.com/create', options)
    .then(r => r.json());
}

function showFeedbackMessage() {
    const feedback = document.getElementById('feedback');
    feedback.classList.add('show');

    setTimeout(() => {
        feedback.classList.remove('show');
    }, 1000);
}

function moveToClipboard(url){
    navigator.clipboard.writeText(url)
    .then(() => {
        showFeedbackMessage(); 
    })
    .catch(err => {
        console.error('Erro ao copiar a URL: ', err);
    });
}

function informationComponent(name, originalUrl, shortenedUrl){
    return `<div style="margin-left: 20px;" class="containerURL">
        <h2>${name}</h2>
        <ul>
            <li>URL original: 
                <a href="${originalUrl}" target="_blank">${originalUrl}</a> 
                <img onclick="moveToClipboard('${originalUrl}')" src="./content_copy_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg" alt="copy"/>
            </li>
            <li>URL encurtada: 
                <a href="${shortenedUrl}" target="_blank">${shortenedUrl}</a> 
                <img onclick="moveToClipboard('${shortenedUrl}')" src="./content_copy_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg" alt="copy"/>
            </li>
        </ul>
    </div>`;
}




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
        for(i = localStorage.length - 1; i > -1; i--){
            const key = localStorage.key(i);
            const item = JSON.parse(localStorage.getItem(key));
            urlsList.innerHTML += informationComponent(item);
    }}
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
    if (originalURL == ""){
        alert("Insira uma url válida");
        return;
    }
    const date = new Date();
    date.setDate(date.getDate() + Number(activeDuration));
    const expirationTimeInSeconds = Math.floor(date.getTime() / 1000).toString();
    const urlData = {
        "originalUrl": originalURL,
        "expirationTime": expirationTimeInSeconds
    }
    getCodeUrl(urlData)
    .then(response => {
        showModal(`https://sjx4g5l0ag.execute-api.us-east-2.amazonaws.com/${response["code"]}`);
        if(checkbox.checked == true){
            if(nameInputElement.value == ""){
                alert("Dê um nome a sua url");
                return;
            }
            if(localStorage.getItem(nameInputElement.value)){
                alert("Uma url salva já tem esse nome, escolha outro");
                return;
            }
            const obj = {
                "name": nameInputElement.value,
                "originalURL": originalURL,
                "shortenedURL": `https://sjx4g5l0ag.execute-api.us-east-2.amazonaws.com/${response["code"]}`,
                "expirationTime": expirationTimeInSeconds
            }
            localStorage.setItem(nameInputElement.value, JSON.stringify(obj));
            urlsList.innerHTML += informationComponent(obj);
        }
        urlInputElement.value = "";
        nameInputElement.value = "";

    })
    .catch((e) => {
        alert("Não foi possível encurtar sua URL, tente mais tarde")
    }) 
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

function removeUrlFromLocalstorage(key){
    localStorage.removeItem(key);
    urlsList.replaceChildren();
    updateUrlList();
}

function showModal(shortenedUrl) {
    const modal = document.getElementById('modal');
    const linkElement = document.getElementById('shortenedLink');
    linkElement.innerHTML = `<a href="${shortenedUrl}" target="_blank">${shortenedUrl}</a> <img onclick="moveToClipboard('${shortenedUrl}')" src="./content_copy_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg" alt="copy"/>`;
    modal.classList.add('show');
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('show');
}

function informationComponent(item){
    const name = item["name"];
    const originalUrl = item["originalURL"];
    const shortenedUrl = item["shortenedURL"];
    const futureTimeInSeconds = Number(item["expirationTime"]);
    let finalStringTime = "";
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    const difference = futureTimeInSeconds - currentTimeInSeconds;

    if (difference <= 0) {
        finalStringTime = "<span>Expirado</span>";
    } else {
        const days = Math.floor(difference / 86400); 
        const hours = Math.floor((difference % 86400) / 3600);
        const minutes = Math.floor((difference % 3600) / 60);
        finalStringTime = `<span>Expira em: ${days} ${days != 1 ? "dias" : "dia"}, ${hours} ${hours != 1 ? "horas" : "hora"} e ${minutes} ${minutes != 1 ? "minutos" : "minuto"}</span>`
    }
    return `<div style="margin-left: 20px;" class="containerURL">
        <h2 class="centerIconText">${name} <img onclick="removeUrlFromLocalstorage('${name}')" src="./deleteImg.svg" alt="delete"/> </h2>
        <ul>
            <li> 
                ${finalStringTime} 
            </li>
            <li class="informationstructure"> 
                
                    <p>URL original:</p>
                    <div>
                        <a href="${originalUrl}" target="_blank">${originalUrl}</a> 
                        <img onclick="moveToClipboard('${originalUrl}')" src="./content_copy_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg" alt="copy"/>
                    </div>
            </li>
            <li class="informationstructure">
                <p>URL encurtada:</p>
                <div>
                    <a href="${shortenedUrl}" target="_blank">${shortenedUrl}</a> 
                    <img onclick="moveToClipboard('${shortenedUrl}')" src="./content_copy_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg" alt="copy"/>
                </div>
            </li>
        </ul>
    </div>`;
}




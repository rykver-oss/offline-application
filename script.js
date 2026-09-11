const screens = document.querySelectorAll(".screen");

const opening = document.getElementById("opening");
const loading = document.getElementById("loading");
const unit = document.getElementById("unit");
const application = document.getElementById("application");
const confirm = document.getElementById("confirm");
const verify = document.getElementById("verify");
const cardScreen = document.getElementById("cardScreen");

const startBtn = document.getElementById("startBtn");

const conclaveBtn = document.getElementById("conclave");
const dissidenceBtn = document.getElementById("dissidence");
const dissonanceBtn = document.getElementById("dissonance");

const nextBtn = document.getElementById("nextBtn");
const editBtn = document.getElementById("editBtn");
const submitBtn = document.getElementById("submitBtn");

const downloadBtn = document.getElementById("downloadBtn");

const loadingProgress = document.getElementById("loadingProgress");
const loadingText = document.getElementById("loadingText");

const verifyProgress = document.getElementById("verifyProgress");
const verifyText = document.getElementById("verifyText");

const applicantName = document.getElementById("name");
const applicantPort = document.getElementById("port");
const applicantPhoto = document.getElementById("photo");

const formerNames = document.getElementById("formerNames");
const formerAffiliations = document.getElementById("formerAffiliations");
const accounts = document.getElementById("accounts");

const summaryCard = document.getElementById("summaryCard");

const cardPhoto = document.getElementById("cardPhoto");
const cardName = document.getElementById("cardName");
const cardPort = document.getElementById("cardPort");
const cardUnit = document.getElementById("cardUnit");
const cardID = document.getElementById("cardID");

const SUPABASE_URL = "https://bqyictbsqmhaegiqqfyy.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_cjJhB1tw4WejDEQvNKFjAA_HoKn2j6C";
const { createClient } = supabase;

const db = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

let selectedUnit = "";
let uploadedImage = "";
let applicationID = "";

function showScreen(screen){

    screens.forEach(current=>{

        current.classList.remove("active");

    });

    screen.classList.add("active");

}

startBtn.addEventListener("click",()=>{

    startLoading();

});

function startLoading(){

    showScreen(loading);

    let value = 0;

    loadingProgress.style.width = "0%";

    const messages = [

        "Initializing...",

        "Connecting to the Underground...",

        "Loading Applicant System...",

        "Preparing Interface...",

        "Complete."

    ];

    loadingText.textContent = messages[0];

    const animation = setInterval(()=>{

        value++;

        loadingProgress.style.width = value + "%";

        if(value < 20){

            loadingText.textContent = messages[0];

        }

        else if(value < 45){

            loadingText.textContent = messages[1];

        }

        else if(value < 70){

            loadingText.textContent = messages[2];

        }

        else if(value < 95){

            loadingText.textContent = messages[3];

        }

        else{

            loadingText.textContent = messages[4];

        }

        if(value >= 100){

            clearInterval(animation);

            setTimeout(()=>{

                showScreen(unit);

            },300);

        }

    },22);

}

conclaveBtn.addEventListener("click",()=>{

    selectedUnit = "CONCLAVE";

    showScreen(application);

});

dissidenceBtn.addEventListener("click",()=>{

    selectedUnit = "DISSIDENCE";

    showScreen(application);

});

dissonanceBtn.addEventListener("click", () => {
    selectedUnit = "DISSONANCE";
    showScreen(application);
});

applicantPhoto.addEventListener("change", (event) => {

    const file = event.target.files[0];

    if (!file) {

        uploadedImage = "";
        return;

    }

    if (!file.type.startsWith("image/")) {

        alert("Please upload a valid image.");

        applicantPhoto.value = "";

        uploadedImage = "";

        return;

    }

    const reader = new FileReader();

    reader.onload = function (e) {

        uploadedImage = e.target.result;

    };

    reader.readAsDataURL(file);

});

nextBtn.addEventListener("click", () => {

    if (applicantName.value.trim() === "") {

        alert("Please enter your Name.");
        applicantName.focus();
        return;

    }

    if (applicantPort.value.trim() === "") {

        alert("Please enter your Port.");
        applicantPort.focus();
        return;

    }

    if (uploadedImage === "") {

        alert("Please upload your Port picture.");
        return;

    }

    buildSummary();

    showScreen(confirm);

});

function buildSummary() {

    summaryCard.innerHTML = `

        <div class="summaryPhoto">

            <img src="${uploadedImage}" alt="Applicant">

        </div>

        <div class="summaryRow">

            <span>Unit</span>

            <p>${selectedUnit}</p>

        </div>

        <div class="summaryRow">

            <span>Name</span>

            <p>${escapeHTML(applicantName.value)}</p>

        </div>

        <div class="summaryRow">

            <span>Port</span>

            <p>${escapeHTML(applicantPort.value)}</p>

        </div>

        <div class="summaryRow">

            <span>Former Names</span>

            <p>${escapeHTML(formerNames.value || "-")}</p>

        </div>

        <div class="summaryRow">

            <span>Former Affiliations</span>

            <p>${escapeHTML(formerAffiliations.value || "-")}</p>

        </div>

        <div class="summaryRow">

            <span>Current Accounts</span>

            <p>${escapeHTML(accounts.value || "-")}</p>

        </div>

    `;

}

editBtn.addEventListener("click", () => {

    showScreen(application);

});

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}

submitBtn.addEventListener("click", async ()=>{

    applicationID = generateApplicationID();

    const imageURL = await uploadApplicantImage();

    const { error } = await db
        .from("applications")
        .insert([{

            application_id: applicationID,

            unit: selectedUnit,

            name: applicantName.value,

            port: applicantPort.value,

            former_names: formerNames.value,

            former_affiliations: formerAffiliations.value,

            current_accounts: accounts.value,

            photo_url: imageURL

        }]);

    if(error){

        alert(error.message);

        console.error(error);

        return;

    }

    startVerification();

});

function startVerification() {

    showScreen(verify);

    verifyProgress.style.width = "0%";

    let progress = 0;

    const messages = [

        "Digging through the archives...",
        "Checking the name on the wall...",
        "Searching the underground archive...",
        "Stamping your file...",
        "Your proof is ready..."

    ];

    verifyText.textContent = messages[0];

    const animation = setInterval(() => {

        progress++;

        verifyProgress.style.width = progress + "%";

        if(progress < 20){

            verifyText.textContent = messages[0];

        }

        else if(progress < 40){

            verifyText.textContent = messages[1];

        }

        else if(progress < 60){

            verifyText.textContent = messages[2];

        }

        else if(progress < 80){

            verifyText.textContent = messages[3];

        }

        else{

            verifyText.textContent = messages[4];

        }

        if(progress >= 100){

            clearInterval(animation);

            generateApplicantCard();

        }

    },20);

}

function generateApplicationID(){

    const now = new Date();

    const year = String(now.getFullYear()).slice(2);

    const month = String(now.getMonth()+1).padStart(2,"0");

    const day = String(now.getDate()).padStart(2,"0");

    const random = Math.floor(1000 + Math.random() * 9000);

    const prefix =
    selectedUnit === "CONCLAVE"
        ? "CON"
        : selectedUnit === "DISSIDENCE"
        ? "DSD"
        : "DSN";
    return `${prefix}-${year}${month}${day}-${random}`;

}

async function cropToPortrait(imageSrc){

    return new Promise((resolve)=>{

        const img = new Image();

        img.onload = function(){

            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = 300;
            canvas.height = 380;

            const targetRatio = 300 / 380;
            const imageRatio = img.width / img.height;

            let sx = 0;
            let sy = 0;
            let sw = img.width;
            let sh = img.height;

            if(imageRatio > targetRatio){

                sw = img.height * targetRatio;
                sx = (img.width - sw) / 2;

            }else{

                sh = img.width / targetRatio;
                sy = (img.height - sh) / 2;

            }

            ctx.drawImage(

                img,

                sx,
                sy,
                sw,
                sh,

                0,
                0,
                300,
                380

            );

            resolve(canvas.toDataURL("image/png"));

        };

        img.src = imageSrc;

    });

}

async function uploadApplicantImage(){

    if(!uploadedImage) return "";

    const file = applicantPhoto.files[0];

    const extension = file.name.split(".").pop();

    const fileName = applicationID + "." + extension;

    const { error } = await db.storage
        .from("applications")
        .upload(fileName, file, {

            upsert:true

        });

    if(error){

        console.error(error);

        return "";

    }

    const { data } = db.storage
        .from("applications")
        .getPublicUrl(fileName);

    return data.publicUrl;

}

async function generateApplicantCard(){

    applicationID = generateApplicationID();

    cardID.textContent = applicationID;
    cardName.textContent = applicantName.value;
    cardPort.textContent = applicantPort.value;
    cardUnit.textContent = selectedUnit;

    if(uploadedImage){

        const cropped = await cropToPortrait(uploadedImage);
        cardPhoto.src = cropped;

    }

    showScreen(cardScreen);

}

async function downloadCard() {

    const card = document.getElementById("card");
    const btn = document.getElementById("downloadBtn");

    btn.disabled = true;
    btn.textContent = "Generating...";

    try {

        card.classList.add("downloading");

        await document.fonts.ready;
        await new Promise(resolve => setTimeout(resolve, 100));

        const canvas = await html2canvas(card, {
            scale: 4,
            useCORS: true,
            backgroundColor: "#0f0f0f"
        });

        card.classList.remove("downloading");

        const link = document.createElement("a");
        link.download = "Applicant-Card.png";
        link.href = canvas.toDataURL("image/png");
        link.click();

        btn.textContent = "Downloaded!";

    } catch (err) {

        console.error(err);
        alert("Failed to generate card.");
        btn.textContent = "DOWNLOAD CARD";

    }

    btn.disabled = false;
}

downloadBtn.addEventListener("click", downloadCard);
var numSessions;

function openTab(evt, tab){
    let i, tabcontent, tablink;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
    }
    tablink = document.getElementsByClassName("tablink");
    for (i = 0; i < tablink.length; i++) {
        tablink[i].className = tablink[i].className.replace(" active", "");
    }
    document.getElementById(tab).style.display = "block";
    evt.currentTarget.className += " active";
}

function addMonthOptions(){
    let newMonth
    months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    monthSelect = document.getElementById("monthDropDown")
    for (i=0; i < 13; i++){
        newMonth = document.createElement("option")
        newMonth.setAttribute("value",months[i])
        if (months[i]==""){
            newMonth.innerHTML = "Select a month"
        } else {
            newMonth.innerHTML = months[i]
        }
        monthSelect.appendChild(newMonth)
    }
}

function onLoad(){
    //if user clicked submit from Invoice Creation
    if (window.location.href.includes("create")){
        document.getElementById("fromCreate").setAttribute("style", "display:block")
        document.getElementById("createButton").setAttribute("class", "tablink")
        document.getElementById("create").setAttribute("style", "display:none")
        document.getElementById("main").setAttribute("style", "display:none")
    } else{
        numSessions = 2
        addMonthOptions()
    }
}

function deleteSession(event){
    //gets the button that was clicked on and removes parent div
    event.target.parentNode.remove()
}


function addSession(){

    let mainDiv = document.getElementById("List-Of-Sessions")
    let newSession = document.createElement("div")
    let dropDownSpan = document.createElement("span")
    let numSpan = document.createElement("span")
    let dateSpan = document.createElement("span")
    let dropDownSelect = document.createElement("select")
    let deleteButton = document.createElement("input")
    dropDownSelect.setAttribute("name","session-type")
    dropDownSelect.setAttribute("required", "")

    deleteButton.setAttribute("type", "button")
    deleteButton.setAttribute("id","deleteSession")
    deleteButton.setAttribute("value","Delete Session")
    deleteButton.addEventListener("click",deleteSession)

    let options = {
        "default": {
            "value": "Select Session"
        },

        "PCS": {
            "value": "Pre-Canskate (PCS)"
        },

        "CS": {
            "value": "Canskate (CS)"
        },

        "FZ": {
            "value": "Fun Zone (FZ)"
        },

        "NV": {
            "value": "Novice (NV)"
        },

        "PEP": {
            "value": "PEP"
        },

        "AD": {
            "value": "Adult (AD)"
        },

        "PW": {
            "value": "Power (PW)"
        },

        "ST": {
            "value": "Stroking (ST)"
        },

        "CIR": {
            "value": "Canskate - Circuit Drawing (CIR)"
        },

        "RPT": {
            "value": "Pre-Canskate/Canskate - Report Card (PCS)"
        }
    }
    newSession.appendChild(dropDownSpan)
    newSession.appendChild(numSpan)
    newSession.appendChild(dateSpan)
    newSession.appendChild(deleteButton)
    mainDiv.appendChild(newSession)
    dropDownSpan.appendChild(dropDownSelect)


    for (const [key, value] of Object.entries(options)){
        dropDown = document.createElement("option")
        if (key == "default"){
            dropDown.setAttribute("value", "")
        } else {
            dropDown.setAttribute("value", key)
        }
        dropDown.innerHTML = value.value
        dropDownSelect.appendChild(dropDown)
        
    }
    
    numInput = document.createElement("input")
    numInput.setAttribute("name","session-amount")
    numInput.setAttribute("type","number")
    numInput.setAttribute("placeholder","Number of Sessions")
    numInput.setAttribute("required","")
    numSpan.appendChild(numInput)

    dateInput = document.createElement("input")
    dateInput.setAttribute("name","date-of-session")
    dateInput.setAttribute("type","date")
    dateInput.setAttribute("required","")
    dateSpan.appendChild(dateInput)

    newSession.setAttribute("id","Session"+numSessions)
    ++numSessions
}
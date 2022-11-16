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
    if (window.location.href.includes("/create?")){
        document.getElementById("fromCreate").setAttribute("style", "display:block")
        document.getElementById("createButton").setAttribute("class", "tablink")
        document.getElementById("create").setAttribute("style", "display:none")
        document.getElementById("main").setAttribute("style", "display:none")
    
        var dict = document.getElementById("result")
        var resultDict = JSON.parse(dict.innerHTML.replaceAll("'","\""))
        dict.innerHTML = ""
        console.log(resultDict)
        for (var x in resultDict){
            var newElement = document.createElement("div")
            for (var y in resultDict[x]){
                var newElementSession = document.createElement("p")
                newElementSession.setAttribute("class", y)
                newElement.appendChild(newElementSession)
                newElementSession.innerHTML = y + " " + resultDict[x][y]
            }
            dict.appendChild(newElement)
        }
    } else{
        //Show notification div after user created an invoice
        if(window.location.href.includes("/?invoiceCreated")){
            document.getElementsByClassName("notification")[0].setAttribute("style", "block")
            document.getElementById("invoice").setAttribute("href", readCookie("invoiceFile"))
            document.getElementById("invoice").innerHTML = "Click Here to Access the Invoice File"
        }
        //should allow user to create another invoice
        numSessions = 2
        addMonthOptions()
    }
}

function readCookie(name){
    var cookieName = name + "="
    let co = decodeURIComponent(document.cookie);
    ca = co.split(';')
    for (var i = 0; i < ca.length; i++){
        var c = ca[i]
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
            }
            if (c.indexOf(cookieName) == 0) {
            return c.substring(cookieName.length, c.length)
            }
        }
    return ""
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

function createInvoice(){
    //After user clicks Confirm button on Confirm Input page an invoice will be created.
    var request = $.ajax({
        url: "/createInvoice",
        type: "POST",
        contentType: "application/json",
        data: {},
        success: function(response){
            window.location.href = "/?invoiceCreated"
            document.cookie = "invoiceFile = "+ response["invoice"]
        }
    }).done(function(request){
    })
}
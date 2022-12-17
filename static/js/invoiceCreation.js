function onChange() {
    var monthDropDown = document.getElementById("monthDropDown")
    var monthValue = monthDropDown.value
    var monthSelected = months.findIndex(element => element == monthValue)
    var season = document.getElementById("season").value
    if (season != ""){
        let year
        if (monthSelected >=9){
            year = season.split('-')[0]
        } else {
            year = season.split('-')[1]
        }
        var dateSelection = document.getElementsByClassName("dateSelection")
        if (monthSelected < 10){
            monthSelected = "0"+monthSelected
        }
        for (var i = 0; i < dateSelection.length; i++){
            dateSelection[i].setAttribute("min",year+"-"+monthSelected+"-01")
            dateSelection[i].setAttribute("max",year+"-"+monthSelected+"-"+getLastDay(monthSelected,year))
        }
    }

    //update sessions
    var inSession, nvSession, jrSession, cirSession, rptSession, fzSession

    inSession = document.getElementsByClassName("IN")
    nvSession = document.getElementsByClassName("NV")
    jrSession = document.getElementsByClassName("JR")
    cirSession = document.getElementsByClassName("CIR")
    rptSession = document.getElementsByClassName("RPT")
    fzSession = document.getElementsByClassName("FZ")

    numSessions = document.getElementsByClassName("sessionSelect").length

    if (season == "2022-2023"){
        for (var i = 0; i < numSessions; i++){
            inSession[i].setAttribute("disabled","")
            inSession[i].setAttribute("hidden","")
            nvSession[i].removeAttribute("disabled","")
            nvSession[i].removeAttribute("hidden","")
            jrSession[i].removeAttribute("disabled","")
            jrSession[i].removeAttribute("hidden","")
            cirSession[i].removeAttribute("disabled","")
            cirSession[i].removeAttribute("hidden","")
            rptSession[i].removeAttribute("disabled","")
            rptSession[i].removeAttribute("hidden","")
            fzSession[i].removeAttribute("disabled","")
            fzSession[i].removeAttribute("hidden","")
        }
    } else {
        for (var i = 0; i < numSessions; i++){
            inSession[i].removeAttribute("disabled","")
            inSession[i].removeAttribute("hidden","")
            nvSession[i].setAttribute("disabled","")
            nvSession[i].setAttribute("hidden","")
            jrSession[i].setAttribute("disabled","")
            jrSession[i].setAttribute("hidden","")
            cirSession[i].setAttribute("disabled","")
            cirSession[i].setAttribute("hidden","")
            rptSession[i].setAttribute("disabled","")
            rptSession[i].setAttribute("hidden","")
            fzSession[i].setAttribute("disabled","")
            fzSession[i].setAttribute("hidden","")
        }
    }

}
function deleteSession(event){
    //gets the button that was clicked on and removes parent div
    event.target.parentNode.remove()
}

function deleteDay(event){
    //gets the button that was clicked on and removes parent div
    event.target.parentNode.parentNode.remove()
}

function addSession(dayNum){
    let mainDiv = document.getElementById("day"+dayNum)
    let newSession = document.createElement("div")
    let dropDownSpan = document.createElement("span")
    let numSpan = document.createElement("span")
    let dropDownSelect = document.createElement("select")
    let deleteButton = document.createElement("input")
    dropDownSelect.setAttribute("name","session-type")
    dropDownSelect.setAttribute("required", "")
    dropDownSelect.setAttribute("class", "sessionSelect"+dayNum+ " sessionSelect")
    newSession.setAttribute("class", "day"+dayNum)

    deleteButton.setAttribute("type", "button")
    deleteButton.setAttribute("id","deleteSession")
    deleteButton.setAttribute("value","Delete Session")
    deleteButton.addEventListener("click",deleteSession)

    newSession.appendChild(dropDownSpan)
    newSession.appendChild(numSpan)
    newSession.appendChild(deleteButton)
    mainDiv.appendChild(newSession)
    dropDownSpan.appendChild(dropDownSelect)


    for (const [key, value] of Object.entries(options)){
        dropDown = document.createElement("option")
        if (key == "default"){
            dropDown.setAttribute("value", "")
            dropDown.setAttribute("selected","")
            dropDown.setAttribute("disabled","")
            dropDown.setAttribute("hidden","")
        } else {
            dropDown.setAttribute("value", key)
            if (key == "IN" || key == "NV" || key == "JR" || key == "CIR" || key == "RPT" || key == "FZ"){
                dropDown.setAttribute("class", key)
            }
        }
        dropDown.innerHTML = value.value
        dropDownSelect.appendChild(dropDown)
 
    }

    numInput = document.createElement("input")
    numInput.setAttribute("name","session-amount")
    numInput.setAttribute("type","number")
    numInput.setAttribute("placeholder","Number of Sessions")
    numInput.setAttribute("required","")
    numInput.setAttribute("class","sessionAmount"+dayNum)
    numSpan.appendChild(numInput)

    onChange()
}

function addDay(){
    ++sessionDay
    parentDiv = document.getElementById("List-Of-Sessions")
    newDayDiv = document.createElement("div")
    newDayDiv.setAttribute("id", "day"+sessionDay)
    newDayDiv.setAttribute('class', 'sessionDay')
    parentDiv.appendChild(newDayDiv)

    //Create day input
    let dateSpan = document.createElement("span")
    dateInput = document.createElement("input")
    dateInput.setAttribute("name","date-of-session")
    dateInput.setAttribute("type","date")
    dateInput.setAttribute("required","")
    dateInput.setAttribute("class","dateSelection")
    dateSpan.appendChild(dateInput)
    newDayDiv.appendChild(dateSpan)

    //Create Delete day input
    let deleteDaySpan = document.createElement('span')
    deleteInput = document.createElement("input")
    deleteInput.setAttribute("value","Delete Day")
    deleteInput.setAttribute("type","button")
    deleteInput.addEventListener("click",deleteDay)
    deleteDaySpan.appendChild(deleteInput)
    newDayDiv.appendChild(deleteDaySpan)

    //Create Add Sessions Button input
    let addSpan = document.createElement('span')
    addInput = document.createElement('input')
    addSpan.setAttribute('id', 'AddSession'+sessionDay)
    addInput.setAttribute('type', 'button')
    addInput.setAttribute('name', 'add-session')
    addInput.setAttribute('value', 'Add Session')
    addInput.setAttribute('onclick', 'addSession("'+sessionDay+'")')

    //Create Coverage Inputs
    let coverageSpan = document.createElement('span')
    coverageLabel = document.createElement('label')
    coverageLabel.innerHTML = "Covering?"
    coverageLabel.setAttribute("for", "cover")
    coverageCheck = document.createElement('input')
    coverageCheck.setAttribute("type", "checkbox")
    coverageCheck.setAttribute('name', "cover")
    coverageCheck.setAttribute('id', "checkbox"+sessionDay)
    coverageCheck.setAttribute("onclick", "checkCover('"+sessionDay+"')")
    coverageInput = document.createElement("input")
    coverageInput.setAttribute("type", "text")
    coverageInput.setAttribute('name', "name-of-cover")
    coverageInput.setAttribute('id', "covername"+sessionDay)
    coverageInput.setAttribute('placeholder', "Name of Coach")
    coverageInput.setAttribute('hidden', '')
    coverageSpan.appendChild(coverageLabel)
    coverageSpan.appendChild(coverageCheck)
    coverageSpan.appendChild(coverageInput)

    addSpan.appendChild(addInput)
    newDayDiv.appendChild(addSpan)
    newDayDiv.appendChild(coverageSpan)

    //create entry for new session under the day
    let newSession = document.createElement("div")
    let dropDownSpan = document.createElement("span")
    let numSpan = document.createElement("span")
    let dropDownSelect = document.createElement("select")
    newSession.setAttribute("class", "day"+sessionDay)
    dropDownSelect.setAttribute("name","session-type")
    dropDownSelect.setAttribute("required", "")
    dropDownSelect.setAttribute("class", "sessionSelect"+sessionDay+ " sessionSelect")

    newSession.appendChild(dropDownSpan)
    newSession.appendChild(numSpan)
    newDayDiv.appendChild(newSession)
    dropDownSpan.appendChild(dropDownSelect)


    for (const [key, value] of Object.entries(options)){
        dropDown = document.createElement("option")
        if (key == "default"){
            dropDown.setAttribute("value", "")
            dropDown.setAttribute("selected","")
            dropDown.setAttribute("disabled","")
            dropDown.setAttribute("hidden","")
        } else {
            dropDown.setAttribute("value", key)
            if (key == "IN" || key == "NV" || key == "JR" || key == "CIR" || key == "RPT" || key == "FZ"){
                dropDown.setAttribute("class", key)
            }
        }
        dropDown.innerHTML = value.value
        dropDownSelect.appendChild(dropDown)
 
    }

    numInput = document.createElement("input")
    numInput.setAttribute("name","session-amount")
    numInput.setAttribute("type","number")
    numInput.setAttribute("placeholder","Number of Sessions")
    numInput.setAttribute("required","")
    numInput.setAttribute("class","sessionAmount"+sessionDay)
    numSpan.appendChild(numInput)

    onChange()

}

function submitForm(){
    data = {}

    for (i = 0; i <= sessionDay; i++){
        sessionsList = {}
        date = document.getElementsByClassName("dateSelection")[i].value
        sessions = document.getElementsByClassName("day"+i)
        sessionSelect = document.getElementsByClassName("sessionSelect"+i)
        sessionAmount = document.getElementsByClassName("sessionAmount"+i)
        for (x = 0; x < sessions.length; x ++){
            text = "session"+x
            sessionsList[text] = {"type": sessionSelect[x].value, "amount": sessionAmount[x].value}
        }

        if (document.getElementById("checkbox"+i).checked){
            coverName = document.getElementById("covername"+i).value
        } else {
            coverName = ""
        }
        data[date] = {"sessions": sessionsList, "cover": coverName}
    }

    var request = $.ajax({
        url: "/create",
        type: "POST",
        headers: {"season": document.getElementsByName("season")[0].value, "month": document.getElementsByName("month")[0].value, 
        "name": document.getElementsByName("name")[0].value, "rate": document.getElementsByName("rate")[0].value, "comments": document.getElementsByName("comments")[0].value},
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function(response){
            today = new Date()
            //set cookie expiry 30 mins after current datetime
            today.setTime(today.getTime() + (30*1000*60))
            window.location.href = "/?invoiceCreated"
            document.cookie = "invoiceFile = "+ response["invoice"] + ";expires="+today.toUTCString()
        },
        error: function(error){
            alert("server error "+ error.status + ": " + error.responseJSON.error)
        }
    }).done()
}

function addMonthOptions(){
    let newMonth
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

function seasonDropDown(elm){
    //Reset sort
    mo = 0
    pcs = 0
    cs = 0
    fz = 0
    nv = 0
    jr = 0
    pep = 0
    ad = 0
    pw = 0
    st = 0
    cir = 0
    rpt = 0
    inter = 0
    x = document.getElementsByClassName("seasonDropdown")
    for (var i = 0; i < x.length; i++){
        if (x[i].classList.contains("show")){
            x[i].classList.toggle("show")
        }
    }
    document.getElementById(elm).classList.toggle("show")
    addSeasonTable(elm,seasonArray.indexOf(elm))
    destroyGraph()
}
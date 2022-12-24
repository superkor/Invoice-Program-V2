var lastImportDay = 0

function addSessionImport(dayNum, season){
    let mainDiv = document.getElementById("importday"+dayNum)
    let newSession = document.createElement("div")
    let dropDownSpan = document.createElement("span")
    let numSpan = document.createElement("span")
    let dropDownSelect = document.createElement("select")
    let deleteButton = document.createElement("input")
    dropDownSelect.setAttribute("name","import-session-type")
    dropDownSelect.setAttribute("required", "")
    dropDownSelect.setAttribute("class", "import-session-type"+dayNum)
    newSession.setAttribute("class", "importday"+dayNum)

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
            dropDown.innerHTML = value.value
            dropDownSelect.appendChild(dropDown)
        } else {
            if (season == "2022-2023"){
                if (key != "IN"){
                    dropDown.setAttribute("value", key)
                    dropDown.innerHTML = value.value
                    dropDownSelect.appendChild(dropDown)
                }
            } else {
                if (key != "NV" && key != "JR" && key != "CIR" && key != "RPT" && key != "FZ"){
                    dropDown.setAttribute("value", key)
                    dropDown.innerHTML = value.value
                    dropDownSelect.appendChild(dropDown)
                }
            }
        }
 
    }

    numInput = document.createElement("input")
    numInput.setAttribute("name","import-session-amount")
    numInput.setAttribute("type","number")
    numInput.setAttribute("placeholder","Number of Sessions")
    numInput.setAttribute("required","")
    numInput.setAttribute("class","import-session-amount"+dayNum)
    numSpan.appendChild(numInput)

    onChange()
}
function uploadInvoice(uploadedFile = true, season="", month=""){
    if(uploadedFile){
        var form_data = new FormData($('#import-invoice')[0])
        url = "/importInvoice"
        requestType = "POST"
    } else {
        var form_data = JSON.stringify({"season": season, "month": month})
        url = "/showExisting"
        requestType = "POST"
    }
        var request = $.ajax({
            url: url,
            type: requestType,
            contentType: false,
            data: form_data,
            processData: false,
            success: function(response){
                document.getElementById("importInfo").innerHTML = ""
                calDiv = document.getElementById("calDiv")
                calDiv.innerHTML = ""
                for (const [key, value] of Object.entries(response["uploadInfo"])){
                    document.getElementById("importInfo").innerHTML += key+": "+value+" "
                }
                document.getElementById("importInfo").innerHTML += "<br>"
                var i=0
                
                season = getSeason(response["uploadInfo"]["year"], response["uploadInfo"]["month"])
                month = response["uploadInfo"]["month"]

                displaySeason = document.createElement("div")
                displaySeason.setAttribute("id", "season")
                displaySeason.innerHTML = season
                calDiv.appendChild(displaySeason)

                displayMonth = document.createElement("div")
                displayMonth.setAttribute("id", "month")
                displayMonth.innerHTML = month
                calDiv.appendChild(displayMonth)

                divContainer = document.createElement("div")
                divContainer.setAttribute('id', "importContainer")
                calDiv.appendChild(divContainer)

                //go through uploadCalendar dict from server
                for (const [date, sessions] of Object.entries(response["uploadCalendar"])){
                    newCalRow = document.createElement("div")
                    newCalRow.setAttribute("id", "importday"+i)
                    newCalRow.setAttribute("class", "sessionDay")
                    //get what day the session occured and set that as default day. also sets min and max dates (based on the invoice month and year)
                    dateSpan = document.createElement("span")
                    newCalRow.appendChild(dateSpan)
                    dateInput = document.createElement("input")
                    dateInput.setAttribute("name","import-date-of-session")
                    dateInput.setAttribute("type","date")
                    dateInput.setAttribute("required","")
                    dateInput.setAttribute("class","import-date-of-session")

                    dateYear = response["uploadInfo"]["year"]

                    dateMonth = months.indexOf(response["uploadInfo"]["month"]).toString()
                    if (dateMonth.length == 1){
                        dateMonth = "0"+dateMonth
                    }
                    dateInput.setAttribute("value", date)
                    dateInput.setAttribute("min",dateYear+"-"+dateMonth+"-01")
                    dateInput.setAttribute("max",dateYear+"-"+dateMonth+"-"+getLastDay(dateMonth,dateYear))
                    dateSpan.appendChild(dateInput)

                    deleteDaySpan = document.createElement("span")
                    newCalRow.appendChild(deleteDaySpan)
                    deleteDayButton = document.createElement("input")
                    deleteDayButton.setAttribute("type", "button")
                    deleteDayButton.setAttribute("value", "Delete Day")
                    deleteDayButton.addEventListener("click", deleteDay)
                    deleteDaySpan.appendChild(deleteDayButton)

                    addSessionSpan = document.createElement("span")
                    newCalRow.appendChild(addSessionSpan)
                    addSessionButton = document.createElement("input")
                    addSessionButton.setAttribute("type", "button")
                    addSessionButton.setAttribute("value", "Add Session")
                    addSessionButton.setAttribute("onclick", "addSessionImport("+i+", '"+season+"')")
                    addSessionSpan.appendChild(addSessionButton)

                    divContainer.appendChild(newCalRow)

                    for (const [x,session] of Object.entries(sessions)){
                        if (x == "cover"){
                            //add covering

                            coverSpan = document.createElement("span")
                            newCalRow.appendChild(coverSpan)
                            coverLabel = document.createElement("label")
                            coverLabel.setAttribute("for", "cover")
                            coverLabel.innerHTML = "Covering?"
                            coverCheckBox = document.createElement("input")
                            coverCheckBox.setAttribute("type", "checkbox")
                            coverCheckBox.setAttribute("name", "cover")
                            coverCheckBox.setAttribute("id", "importcheckbox"+i)
                            coverCheckBox.setAttribute("onclick", "checkCover('"+i+"', true)")
                            coverInput = document.createElement("input")
                            coverInput.setAttribute("type", "text")
                            coverInput.setAttribute("name", "name-of-cover")
                            coverInput.setAttribute("id", "importcovername"+i)
                            coverInput.setAttribute("placeholder", "Name of Coach")

                            if (session != ""){
                                coverCheckBox.checked = true
                                coverInput.value = session
                                coverInput.setAttribute("required", "")
                            } else {
                                coverInput.setAttribute("hidden", "")
                                coverInput.value = ""
                            }
                            coverSpan.appendChild(coverLabel)
                            coverSpan.appendChild(coverCheckBox)
                            coverSpan.appendChild(coverInput)
                        }
                        if (x == "sessions"){
                            for (const [sessionNum, sessionDict] of Object.entries(session)){
                                infoDiv = document.createElement("div")
                                infoDiv.setAttribute("class", "importday"+i)
                                newCalRow.appendChild(infoDiv)
                                newSpan = document.createElement("span")
                                infoDiv.appendChild(newSpan)
                                newDropDown = document.createElement("select")
                                newSpan.appendChild(newDropDown)
                                newDropDown.setAttribute("name", "import-session-type")
                                newDropDown.setAttribute("class", "import-session-type"+i)
                                newDropDown.setAttribute("required","")
                                //go through options dict for drop down. display default option if that's the session for that day. exclude options based on season
                                for (const [sessionValue, sessionName] of Object.entries(options)){
                                    if (sessionValue != "default"){
                                        if (season == "2022-2023"){
                                            if (sessionValue != "IN"){
                                                dropDown = document.createElement("option")
                                                dropDown.setAttribute("value", sessionValue)
                                                dropDown.innerHTML = sessionName.value
                                                newDropDown.appendChild(dropDown)
                                            }
                                        } else {
                                            if (sessionValue != "NV" && sessionValue != "JR" && sessionValue != "CIR" && sessionValue != "RPT" && sessionValue != "FZ"){
                                                dropDown = document.createElement("option")
                                                dropDown.setAttribute("value", sessionValue)
                                                dropDown.innerHTML = sessionName.value
                                                newDropDown.appendChild(dropDown)
                                            }
                                        }
                                        if (sessionValue == session[sessionNum]["type"]){
                                            dropDown.setAttribute("selected","")
                                        }
                                    }
                                }
                                //get amount of session on that day and set that as default value
                                newSpanSessionAmount = document.createElement("span")
                                infoDiv.appendChild(newSpanSessionAmount)
                                numInput = document.createElement("input")
                                newSpanSessionAmount.appendChild(numInput)
                                numInput.setAttribute("name","import-session-amount")
                                numInput.setAttribute("class","import-session-amount"+i)
                                numInput.setAttribute("type","number")
                                numInput.setAttribute("placeholder","Number of Sessions")
                                numInput.setAttribute("required","")
                                numInput.setAttribute("value",session[sessionNum]["amount"])
                                
                                deleteButton = document.createElement("input")
                                deleteButton.setAttribute("type", "button")
                                deleteButton.setAttribute("id","deleteSession")
                                deleteButton.setAttribute("value","Delete Session")
                                deleteButton.addEventListener("click",deleteSession)
                                infoDiv.appendChild(deleteButton)
                            }
                        }
                    }
                    ++i
                    lastImportDay = i
                }

                //add button to add new sessions
                var addNewSession = document.createElement("input")
                calDiv.appendChild(addNewSession)
                addNewSession.setAttribute("type", "button")
                addNewSession.setAttribute("id", "import-add-day")
                addNewSession.setAttribute("onclick", "newSession('"+response["uploadInfo"]["month"]+"',"+dateYear+")")
                addNewSession.setAttribute("value", "Add Day")

                //add button to submit changes to server
                var submitButton = document.createElement("input")
                calDiv.appendChild(submitButton)
                submitButton.setAttribute("type", "submit")
                submitButton.setAttribute("value", "Update")
                submitButton.setAttribute("onclick", "updateImport('"+response["uploadInfo"]["month"]+"',"+dateYear+",'"+response["uploadInfo"]["name"]+"','"+response["uploadInfo"]["rate"]+"')")
            },
            error: function(error){
                alert("server error "+ error.status + ": " + error.responseJSON.error)
            }
        }).done()
}

function newSession(month, year){
    sessionDiv = document.getElementById("importContainer")
    season = getSeason(year, month)

    newInfo = document.createElement("div")
    sessionDiv.appendChild(newInfo)
    newInfo.setAttribute("class", "sessionDay")

    dateSpan = document.createElement("span")
    newInfo.appendChild(dateSpan)
    newInfo.setAttribute("id", "importday"+lastImportDay)
    dateInput = document.createElement("input")
    dateInput.setAttribute("name","import-date-of-session")
    dateInput.setAttribute("type","date")
    dateInput.setAttribute("required","")
    dateInput.setAttribute("class","import-date-of-session")

    dateMonth = months.indexOf(month).toString()
    if (dateMonth.length == 1){
        dateMonth = "0"+dateMonth
    }
    dateInput.setAttribute("min",year+"-"+dateMonth+"-01")
    dateInput.setAttribute("max",year+"-"+dateMonth+"-"+getLastDay(dateMonth,year))
    dateSpan.appendChild(dateInput)

    deleteDaySpan = document.createElement("span")
    newInfo.appendChild(deleteDaySpan)
    deleteDayButton = document.createElement("input")
    deleteDayButton.setAttribute("type", "button")
    deleteDayButton.setAttribute("value", "Delete Day")
    deleteDayButton.addEventListener("click", deleteDay)
    deleteDaySpan.appendChild(deleteDayButton)

    addSessionSpan = document.createElement("span")
    newInfo.appendChild(addSessionSpan)
    addSessionButton = document.createElement("input")
    addSessionButton.setAttribute("type", "button")
    addSessionButton.setAttribute("value", "Add Session")
    addSessionButton.setAttribute("onclick", "addSessionImport("+lastImportDay+")")
    addSessionSpan.appendChild(addSessionButton)

    monthIndex = months.indexOf(month).toString()

    sessionInput = document.createElement("div")
    sessionInput.setAttribute("class", "importday"+lastImportDay)

    newInfo.appendChild(sessionInput)

    dropDownSpan = document.createElement("span")
    sessionInput.appendChild(dropDownSpan)
    newDropDown = document.createElement("select")
    dropDownSpan.appendChild(newDropDown)
    newDropDown.setAttribute("name", "import-session-type")
    newDropDown.setAttribute("class", "import-session-type"+lastImportDay)
    newDropDown.setAttribute("required","")

    season = getSeason(year, month)

    for (const [sessionValue, sessionName] of Object.entries(options)){
        if (sessionValue != "default"){
            if (season == "2022-2023"){
                if (sessionValue != "IN"){
                    dropDown = document.createElement("option")
                    dropDown.setAttribute("value", sessionValue)
                    dropDown.innerHTML = sessionName.value
                    newDropDown.appendChild(dropDown)
                }
            } else {
                if (sessionValue != "NV" && sessionValue != "JR" && sessionValue != "CIR" && sessionValue != "RPT" && sessionValue != "FZ"){
                    dropDown = document.createElement("option")
                    dropDown.setAttribute("value", sessionValue)
                    dropDown.innerHTML = sessionName.value
                    newDropDown.appendChild(dropDown)

                }
            }
        }
        else {
            dropDown = document.createElement("option")
            dropDown.setAttribute("value", sessionValue)
            dropDown.setAttribute("selected","")
            dropDown.innerHTML = sessionName.value
            newDropDown.appendChild(dropDown)
        }
        
    }

    newSpanSessionAmount = document.createElement("span")
    sessionInput.appendChild(newSpanSessionAmount)
    numInput = document.createElement("input")
    newSpanSessionAmount.appendChild(numInput)
    numInput.setAttribute("name","import-session-amount")
    numInput.setAttribute("class","import-session-amount"+lastImportDay)
    numInput.setAttribute("type","number")
    numInput.setAttribute("placeholder","Number of Sessions")
    numInput.setAttribute("required","")

    ++lastImportDay
}

function updateImport(month, year, name, rate){
    data = {}

    date = document.getElementsByClassName("import-date-of-session")
    dateArrayLength = date.length
    dateArrayIndex = 0

    for (i = 0; i < lastImportDay; i++){
        sessionsList = {}
        if (document.getElementById("importday"+i) != null){
                sessions = document.getElementsByClassName("importday"+i)
                sessionSelect = document.getElementsByClassName("import-session-type"+i)
                sessionAmount = document.getElementsByClassName("import-session-amount"+i)
                dateOutput = date[dateArrayIndex].value
                for (x = 0; x < sessions.length; x ++){
                    text = "session"+x
                    sessionsList[text] = {"type": sessionSelect[x].value, "amount": sessionAmount[x].value}
                }
                if (document.getElementById('importcheckbox'+i).checked){
                    coverName = document.getElementById('importcovername'+i).value
                } else {
                    coverName = ""
                }
                data[dateOutput] = {'sessions': sessionsList, 'cover': coverName}
                dateArrayIndex++
        }
    }

    season = getSeason(year, month)

    var request = $.ajax({
        url: "/updateImport",
        type: "POST",
        headers: {"season": season, "month": month, 
        "name": name, "rate": rate, "comments": ""},
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
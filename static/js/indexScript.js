var numSessions

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

    "IN":{
        "value": "Intermediate (IN)"
    },

    "NV": {
        "value": "Novice (NV)"
    },

    "JR": {
        "value": "Junior (JR)"
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
        "value": "Pre-Canskate/Canskate - Report Card (RPT)"
    }
}

//vars for sorting by header; 0 for high to low (month will be sorted in normal order), 1 for sort by low to high (month has no option for 1)
var mo = 0
var pcs = 0
var cs = 0
var fz = 0
var nv = 0
var jr = 0
var pep = 0
var ad = 0
var pw = 0
var st = 0
var cir = 0
var rpt = 0
var inter = 0
var hr = 0

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

    if (tab == "summary"){
        //After user clicks Confirm button on Confirm Input page an invoice will be created.
        var request = $.ajax({
            url: "/summaryInvoice",
            type: "GET",
            contentType: "application/json",
            data: {},
            success: function(response){
               summaryInvoice(response["invoiceTable"])
            },
            error: function(error){
                alert("server error "+ error.status + ": " + error.responseJSON.error)
            }
        }).done()
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
}

function summaryInvoice(invoiceTable){
    div = document.getElementsByClassName("monthInformation")
    for (y in div){
        div[y].textContent = ""
    }
    //List all created invoices from list_invoice table
    for (x in invoiceTable){
        w = seasonArray.indexOf(invoiceTable[x][0])
        newDiv = document.createElement("div")
        newDiv.setAttribute("style", "text-align: left; padding: 2rem 2rem;")
        div[w].appendChild(newDiv)
        newRow = document.createElement("a")
        newRow.setAttribute("class", "invoiceRow")
        newRow.setAttribute("style", "float: left; display: inline-block; vertical-align:center; padding: 1rem 1rem;")

        newDeleteA = document.createElement("a")
        newDeleteButton = document.createElement("button")
        newDeleteA.setAttribute("style", "float: left; display: inline-block; vertical-align:center; padding: 1rem 1rem;")
        newDeleteButton.innerHTML = "Delete Invoice"
        var parms = ""


        for (y in invoiceTable[x]){
            if (y != 2){
                newRow.innerHTML += " " + invoiceTable[x][y]
                parms += invoiceTable[x][y] + " "
            } else {
                newRow.setAttribute("href", invoiceTable[x][y])
            }
        }
        newDeleteA.setAttribute("onclick", "deleteInvoice('"+parms+"')")
        newDiv.appendChild(newRow)
        newDeleteA.appendChild(newDeleteButton)
        newDiv.setAttribute("id", parms)
        newDiv.appendChild(newDeleteA)
    }
}

function deleteInvoice(parms, elm){
    season = parms.split(" ")[0]
    month = parms.split(" ")[1]
    sendParm = season + " " + month

    var request = $.ajax({
        url: "/deleteInvoice",
        type: "POST",
        headers: {},
        contentType: "application/json",
        data: JSON.stringify({"parms": sendParm}),
        success: function(response){
            document.getElementById(parms).remove()
        },
        error: function(error){
            alert("server error "+ error.status + ": " + error.responseJSON.error)
        }
    }).done()
}

function addSeasonTable(season,x){
    var request = $.ajax({
        url: "/getInvoice",
        type: "GET",
        headers: {"season": season},
        contentType: "application/json",
        data: {},
        success: function(response){
            table = response["seasonTable"]
            if (table == 0){
                document.getElementsByClassName("seasonTable")[x].innerHTML = "<br>No invoices found for this season"
            } else {
                document.getElementsByClassName("seasonTable")[x].textContent = ""
                seasonTable = document.createElement("table")
                document.getElementsByClassName("seasonTable")[x].appendChild(seasonTable)
                tr = document.createElement("tr")
                seasonTable.appendChild(tr)
                for (var m = 0; m < headerRow.length; m ++){
                    th = document.createElement("th")
                    th.setAttribute("onclick", "sortBasedOnHeader('"+headerRow[m]+"', '"+ season + "')")
                    tr.appendChild(th)
                    th.innerHTML = headerRow[m]
                }
                for (y in table){
                    tr = document.createElement("tr")
                    seasonTable.appendChild(tr)
                    for (w in table[y]){
                        td = document.createElement("td")
                        tr.appendChild(td)
                        td.innerHTML = table[y][w]
                    }
                }
            }
        },
        error: function(error){
            alert("server error "+ error.status + ": " + error.responseJSON.error)
        }
    }).done()
    graph(season)
}

function sortBasedOnHeader(header, season){
    sort = {header: "", order: ""}
    switch (header){
        case "Month":
            if(!mo){
                sort["header"] = "MONTH"
                sort["order"] = "DESC"
                mo = 1
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
                hr = 0
            }
            else{
                sort["header"] = "MONTH"
                sort["order"] = "ASC"
                mo = 0
            }
            break
        case 'PreCanskate (PCS)':
            if (!pcs){
                sort["header"] = "PCS"
                sort["order"] = "DESC"
                pcs = 1
                mo = 0
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
                hr = 0
            }
            else{
                sort["header"] = "PCS"
                sort["order"] = "ASC"
                pcs = 0
            }
            break
        case 'Canskate (CS)':
            if (!cs){
                sort["header"] = "CS"
                sort["order"] = "DESC"
                cs = 1
                pcs = 0
                mo = 0
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
                hr = 0
            }
            else{
                sort["header"] = "CS"
                sort["order"] = "ASC"
                cs = 0
            }
            break
        case 'Funzone (FZ)':
            if (!fz){
                sort["header"] = "FZ"
                sort["order"] = "DESC"
                fz = 1
                pcs = 0
                cs = 0
                mo = 0
                nv = 0
                jr = 0
                pep = 0
                ad = 0
                pw = 0
                st = 0
                cir = 0
                rpt = 0
                inter = 0
                hr = 0
            }
            else{
                sort["header"] = "FZ"
                sort["order"] = "ASC"
                fz = 0
            }
            break
        case 'Novice (NV)':
            if (!nv){
                sort["header"] = "NV"
                sort["order"] = "DESC"
                nv = 1
                pcs = 0
                cs = 0
                fz = 0
                mo = 0
                jr = 0
                pep = 0
                ad = 0
                pw = 0
                st = 0
                cir = 0
                rpt = 0
                inter = 0
                hr = 0
            }
            else{
                sort["header"] = "NV"
                sort["order"] = "ASC"
                nv = 0
            }
            break
        case 'Junior (JR)':
            if (!jr){
                sort["header"] = "JR"
                sort["order"] = "DESC"
                nv = 1
                pcs = 0
                cs = 0
                fz = 0
                mo = 0
                jr = 0
                pep = 0
                ad = 0
                pw = 0
                st = 0
                cir = 0
                rpt = 0
                inter = 0
                hr = 0
            }
            else{
                sort["header"] = "JR"
                sort["order"] = "ASC"
                jr = 0
            }
            break
        case 'Performance Enrichment Program (PEP)':
            if (!pep){
                sort["header"] = "PEP"
                sort["order"] = "DESC"
                pep = 1
                pcs = 0
                cs = 0
                fz = 0
                nv = 0
                jr = 0
                mo = 0
                ad = 0
                pw = 0
                st = 0
                cir = 0
                rpt = 0
                inter = 0
                hr = 0
            }
            else{
                sort["header"] = "PEP"
                sort["order"] = "ASC"
                pep = 0
            }
            break
        case 'Adult (AD)':
            if (!ad){
                sort["header"] = "AD"
                sort["order"] = "DESC"
                ad = 1
                pcs = 0
                cs = 0
                fz = 0
                nv = 0
                jr = 0
                pep = 0
                mo = 0
                pw = 0
                st = 0
                cir = 0
                rpt = 0
                inter = 0
                hr = 0
            }
            else{
                sort["header"] = "AD"
                sort["order"] = "ASC"
                ad = 0
            }
            break
        case 'Power Skate (PW)':
            if (!pw){
                sort["header"] = "PW"
                sort["order"] = "DESC"
                pw = 1
                pcs = 0
                cs = 0
                fz = 0
                nv = 0
                jr = 0
                pep = 0
                ad = 0
                mo = 0
                st = 0
                cir = 0
                rpt = 0
                inter = 0
                hr = 0
            }
            else{
                sort["header"] = "PW"
                sort["order"] = "ASC"
                pw = 0
            }
            break
        case 'Stroking (ST)':
            if (!st){
                sort["header"] = "ST"
                sort["order"] = "DESC"
                st = 1
                pcs = 0
                cs = 0
                fz = 0
                nv = 0
                jr = 0
                pep = 0
                ad = 0
                pw = 0
                mo = 0
                cir = 0
                rpt = 0
                inter = 0
                hr = 0
            }
            else{
                sort["header"] = "ST"
                sort["order"] = "ASC"
                st = 0
            }
            break
        case 'Canskate - Circuit Drawing (CIR)':
            if (!cir){
                sort["header"] = "CIR"
                sort["order"] = "DESC"
                cir = 1
                pcs = 0
                cs = 0
                fz = 0
                nv = 0
                jr = 0
                pep = 0
                ad = 0
                pw = 0
                st = 0
                mo = 0
                rpt = 0
                inter = 0
                hr = 0
            }
            else{
                sort["header"] = "CIR"
                sort["order"] = "ASC"
                cir = 0
            }
            break
        case 'Pre-Canskate/Canskate - Report Card (RPT)':
            if (!rpt){
                sort["header"] = "RPT"
                sort["order"] = "DESC"
                rpt = 1
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
                mo = 0
                inter = 0
                hr = 0
            }
            else{
                sort["header"] = "RPT"
                sort["order"] = "ASC"
                rpt = 0
            }
            break
        case 'Intermediate (IN)':
            if (!inter){
                sort["header"] = "INTER"
                sort["order"] = "DESC"
                inter = 1
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
                mo = 0
                hr = 0
            }
            else{
                sort["header"] = "INTER"
                sort["order"] = "ASC"
                inter = 0
            }
            break
        case 'Hours':
            if (!hr){
                sort["header"] = "HOURS"
                sort["order"] = "DESC"
                inter = 0
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
                mo = 0
                hr = 1
            }
            else{
                sort["header"] = "HOURS"
                sort["order"] = "ASC"
                hr = 0
            }
            break
    }

    shortArray = ["MONTH", "PCS", "CS", "FZ", "NV", "JR", "PEP", "AD", "PW", "ST", "CIR", "RPT", "INTER", 'HOURS']

    var request = $.ajax({
        url: "/sortInvoice",
        type: "GET",
        headers: {"season": season, "header": sort["header"], "order": sort["order"]},
        contentType: "application/json",
        data: {},
        success: function(response){
            x = seasonArray.indexOf(season)
            table = response["sortedTable"]
            document.getElementsByClassName("seasonTable")[x].textContent = ""
            seasonTable = document.createElement("table")
            document.getElementsByClassName("seasonTable")[x].appendChild(seasonTable)
            tr = document.createElement("tr")
            seasonTable.appendChild(tr)
            for (var m = 0; m < shortArray.length; m ++){
                th = document.createElement("th")
                th.setAttribute("onclick", "sortBasedOnHeader('"+headerRow[m]+"', '"+ season + "')")
                tr.appendChild(th)
                th.innerHTML = headerRow[m]
                if (shortArray[m] == sort["header"]){
                    if (sort["order"] == "DESC"){
                        th.innerHTML += " <i class = 'arrow down'></i>"
                    } else {
                        th.innerHTML += " <i class = 'arrow up'></i>"
                    }
                }  
            }
            for (y in table){
                tr = document.createElement("tr")
                seasonTable.appendChild(tr)
                for (w in table[y]){
                    td = document.createElement("td")
                    tr.appendChild(td)
                    td.innerHTML = table[y][w]
                }
            }
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

function getLastDay(month, year){
    const date = new Date(year, month, 0)
    let lastDay = date.getDate()
    if (lastDay < 10){
        lastDay = "0"+lastDay
    }
    return date.getDate()
}

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
        } else {
            document.cookie = "invoiceFile =; expires= Thu, 01 Jan 1970 00:00:00 UTC;"
            }
        //should allow user to create another invoice
        numSessions = 1
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
    numSpan.appendChild(numInput)

    dateInput = document.createElement("input")
    dateInput.setAttribute("name","date-of-session")
    dateInput.setAttribute("type","date")
    dateInput.setAttribute("required","")
    dateInput.setAttribute("class","dateSelection")
    dateSpan.appendChild(dateInput)

    newSession.setAttribute("id","Session"+numSessions)
    ++numSessions
    onChange()
}

function createInvoice(){
    //After user clicks Confirm button on Confirm Input page an invoice will be created.
    var request = $.ajax({
        url: "/createInvoice",
        type: "POST",
        contentType: "application/json",
        data: {},
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

function getSeason(year, month){
    month = months.indexOf(month)
    if (month >= 9){
        return year+"-"+(year-1+2)
    } else {
        return (year-1)+"-"+(year)
    }
}

function uploadInvoice(){
    var form_data = new FormData($('#import-invoice')[0])
    var request = $.ajax({
        url: "/importInvoice",
        type: "POST",
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

            sessionDiv = document.createElement("div")
            sessionDiv.setAttribute("id", "sessionsFromImport")
            calDiv.appendChild(sessionDiv)

            //go through uploadCalendar dict from server
            for (const [key, value] of Object.entries(response["uploadCalendar"])){
                //semicolons separate between different session types in one day. # of semicolons - 1 = number of sessions in that day
                valueArrayLength = value.split(";").length - 1
                for (var x = 0; x < valueArrayLength; x++){
                    newCalRow = document.createElement("div")
                    newCalRow.setAttribute("id", "import"+i)
                    sessionDiv.appendChild(newCalRow)
                    newSpan = document.createElement("span")
                    newCalRow.appendChild(newSpan)
                    newDropDown = document.createElement("select")
                    newSpan.appendChild(newDropDown)
                    newDropDown.setAttribute("name", "import-session-type")
                    newDropDown.setAttribute("class", "import-session-type")
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
                            if (sessionValue == value.split(";")[x].split(" ")[0]){
                                dropDown.setAttribute("selected","")
                                i++
                            }
                        }
                    }
                    
                    //get amount of session on that day and set that as default value
                    newSpanSessionAmount = document.createElement("span")
                    newCalRow.appendChild(newSpanSessionAmount)
                    numInput = document.createElement("input")
                    newSpanSessionAmount.appendChild(numInput)
                    numInput.setAttribute("name","import-session-amount")
                    numInput.setAttribute("class","import-session-amount")
                    numInput.setAttribute("type","number")
                    numInput.setAttribute("placeholder","Number of Sessions")
                    numInput.setAttribute("required","")
                    numInput.setAttribute("value",value.split(";")[x].split(" ")[2])
                    
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
                    dateDay = key.split(" ")[1]
                    if (dateDay.length == 1){
                        dateDay = "0"+dateDay
                    }
                    dateInput.setAttribute("value", dateYear+"-"+dateMonth+"-"+dateDay)
                    dateInput.setAttribute("min",dateYear+"-"+dateMonth+"-01")
                    dateInput.setAttribute("max",dateYear+"-"+dateMonth+"-"+getLastDay(dateMonth,dateYear))
                    dateSpan.appendChild(dateInput)
                    
                    //add delete session button to delete session
                    deleteButton = document.createElement("input")
                    deleteButton.setAttribute("type", "button")
                    deleteButton.setAttribute("id","deleteSession")
                    deleteButton.setAttribute("value","Delete Session")
                    deleteButton.addEventListener("click",deleteSession)
                    newCalRow.appendChild(deleteButton)

                }
            }
            
            //add button to add new sessions
            var addNewSession = document.createElement("input")
            calDiv.appendChild(addNewSession)
            addNewSession.setAttribute("type", "button")
            addNewSession.setAttribute("id", "import-add-session")
            addNewSession.setAttribute("onclick", "newSession('"+response["uploadInfo"]["month"]+"',"+dateYear+")")
            addNewSession.setAttribute("value", "Add Session")

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
    sessionDiv = document.getElementById("sessionsFromImport")
    season = getSeason(year, month)

    var addNewSession = document.createElement("div")
    sessionDiv.appendChild(addNewSession)

    monthIndex = months.indexOf(month).toString()

    dropDownSpan = document.createElement("span")
    addNewSession.appendChild(dropDownSpan)
    newDropDown = document.createElement("select")
    dropDownSpan.appendChild(newDropDown)
    newDropDown.setAttribute("name", "import-session-type")
    newDropDown.setAttribute("class", "import-session-type")
    newDropDown.setAttribute("required","")


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
    addNewSession.appendChild(newSpanSessionAmount)
    numInput = document.createElement("input")
    newSpanSessionAmount.appendChild(numInput)
    numInput.setAttribute("name","import-session-amount")
    numInput.setAttribute("class","import-session-amount")
    numInput.setAttribute("type","number")
    numInput.setAttribute("placeholder","Number of Sessions")
    numInput.setAttribute("required","")

    dateSpan = document.createElement("span")
    addNewSession.appendChild(dateSpan)
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
    
    //add delete session button to delete session
    deleteButton = document.createElement("input")
    deleteButton.setAttribute("type", "button")
    deleteButton.setAttribute("id","deleteSession")
    deleteButton.setAttribute("value","Delete Session")
    deleteButton.addEventListener("click",deleteSession)
    addNewSession.appendChild(deleteButton)

}

function updateImport(month, year, name, rate){
    selectedSessions = document.getElementsByClassName("import-session-type")
    selectedAmounts = document.getElementsByClassName("import-session-amount")
    selectedDates = document.getElementsByClassName("import-date-of-session")

    sessions = [], amounts = [], dates = []

    for (var i = 0; i < selectedSessions.length; i++){
        sessions.push(selectedSessions[i].value)
        amounts.push(selectedAmounts[i].value)
        dates.push(selectedDates[i].value)
    }

    season = getSeason(year, month)

    data = {"season": season, "month": month, "sessions": sessions, "amount": amounts, "date": dates, "name": name, "rate": rate, "comments": ""}
    console.log(data)

    var request = $.ajax({
        url: "/updateImport",
        type: "POST",
        processData: false,
        contentType: false,
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
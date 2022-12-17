var sessionDay = 0
var lastImportDay = 0

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

function getSeason(year, month){
    month = months.indexOf(month)
    if (month >= 9){
        return year+"-"+(year-1+2)
    } else {
        return (year-1)+"-"+(year)
    }
}

function checkCover(elm, importInvoice=false){
    if (!importInvoice){
        coachInput = document.getElementById("covername"+elm)
        if (document.getElementById("checkbox"+elm).checked){

            coachInput.removeAttribute('hidden')
            coachInput.setAttribute("required", "")
        } else{
            coachInput.setAttribute('hidden', "")
            coachInput.removeAttribute("required")
        }
    } else {
        coachInput = document.getElementById("importcovername"+elm)
        if (document.getElementById("importcheckbox"+elm).checked){

            coachInput.removeAttribute('hidden')
            coachInput.setAttribute("required", "")
        } else{
            coachInput.setAttribute('hidden', "")
            coachInput.removeAttribute("required")
        }
    }
}
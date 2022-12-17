function summaryInvoice(invoiceTable){
    div = document.getElementsByClassName("monthInformation")
    for (y in div){
        div[y].textContent = ""
    }
    //List all created invoices from list_invoice table
    for (x in invoiceTable){
        w = seasonArray.indexOf(invoiceTable[x][0])
        newDiv = document.createElement("div")
        infoWrapperDiv = document.createElement('div')
        newDiv.appendChild(infoWrapperDiv)
        div[w].appendChild(newDiv)
        newRow = document.createElement("a")
        newRow.setAttribute("class", "invoiceRow")

        newDeleteA = document.createElement("a")
        newDeleteButton = document.createElement("button")
        newDeleteButton.innerHTML = "Delete Invoice"
        var parms = ""


        for (y in invoiceTable[x]){
            if (y == 0){
                newRow.innerHTML += " Click Here to Access " + invoiceTable[x][y] + " "
                parms += invoiceTable[x][y] + " "
            } else if (y == 1){
                newRow.innerHTML += invoiceTable[x][y] + " Invoice"
                parms += invoiceTable[x][y] + " "
            }else {
                newRow.setAttribute("href", invoiceTable[x][y])
            }
        }
        newDeleteA.setAttribute("onclick", "deleteInvoice('"+parms+"')")
        infoWrapperDiv.appendChild(newRow)
        newDeleteA.appendChild(newDeleteButton)
        infoWrapperDiv.setAttribute("id", parms)
        infoWrapperDiv.appendChild(newDeleteA)

        newUpdateA = document.createElement("a")
        newUpdateButton = document.createElement("button")
        newUpdateButton.innerHTML = "Update Invoice"
        newUpdateButton.setAttribute("onclick", "updateExistingInvoice('"+parms+"')")
        infoWrapperDiv.appendChild(newUpdateA)
        newUpdateA.appendChild(newUpdateButton)
    }
}

function deleteInvoice(parms){
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

function getLastDay(month, year){
    const date = new Date(year, month, 0)
    let lastDay = date.getDate()
    if (lastDay < 10){
        lastDay = "0"+lastDay
    }
    return date.getDate()
}
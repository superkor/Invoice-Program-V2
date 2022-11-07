function openTab(evt, tab){
    var i, tabcontent, tablink;
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
    var newMonth
    months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    monthSelect = document.getElementById("monthDropDown")
    for (i=0; i < 12; i++){
        newMonth = document.createElement("option")
        newMonth.setAttribute("value",months[i])
        newMonth.innerHTML = months[i]
        monthSelect.appendChild(newMonth)
    }
}

function onLoad(){
    addMonthOptions();
}
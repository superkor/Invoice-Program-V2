function updateExistingInvoice(parms){
    document.getElementById("importButton").click()
    uploadInvoice(uploadedFile = false, parms.split(" ")[0], parms.split(" ")[1])
}
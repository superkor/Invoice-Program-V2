from flask import Flask, abort, render_template, request, jsonify, send_file
import static.python.invoiceCreation as invoice
import static.python.invoiceSummary as summary
import static.python.invoiceUpload as upload
from mysql.connector import errorcode
from werkzeug.utils import secure_filename
import os
import json

app = Flask(__name__, template_folder='templates')
app.config['UPLOAD_FOLDER'] = "invoice/upload"
ALLOWED_EXTENSIONS = {'xlsx'}


"""
TODO
✅ Added check when creating invoice for a season and month that already exists
✅ Added import invoice (able to upload and edit)
✅ Allowed deletion of existing invoice
✅ Added option to view existing invoices
✅ Added table of sessions done per season based on existing invoices
- Add option to sessions that user covered someone
- Change amount of sessions on calendar to amount of minutes
- Add update/edit function for an existing invoice
- Add some data analysis in summary
"""

@app.route("/")
def home():
    return render_template('index.html')

@app.route("/create", methods=["GET"])
def getInfo():
    season = request.args.get('season')
    month = request.args.get('month')
    name=request.args.get("name")
    rate=request.args.get("rate")
    comments = request.args.get("comments")
    listSessions = request.args.getlist("session-type")
    listSessionsAmount = request.args.getlist("session-amount")
    listSessionsDate = request.args.getlist("date-of-session")

    numberSessions = len(listSessions)
    numberAmount = len(listSessionsAmount)
    numberDate = len(listSessionsDate)

    #raise 400 if session data array doesn't have the same length
    if (numberAmount != numberSessions or numberSessions != numberDate):
        abort(400, description="Sessions has missing data "+ str({"session-type": listSessions, "sessions-amount": listSessionsAmount, "date-of-session": listSessionsDate}))
    elif (numberAmount == 0 or numberSessions == 0 or numberDate == 0):
        abort(400, description= "Empty query")

    sessions = {}
    #creating dict of sessions
    for x in range (numberSessions):
        sessions["session"+str(x)] = {"type": listSessions[x], "amount": listSessionsAmount[x], "date": listSessionsDate[x]}

    if comments == None:
        comments = ""

    global invoiceDict
    invoiceDict = {
        "season": season,
        "month": month,
        "name": name,
        "rate": rate,
        "comments": comments,
        "sessions": sessions
    }

    return render_template('index.html', **invoiceDict)

@app.errorhandler(400)
def serverError(e):
    return render_template("400.html", error = e), 400

@app.route('/createInvoice', methods=["POST"])
def createInvoice():
    try:
        newInvoice = invoice.createInvoice(invoiceDict.get('season'), invoiceDict.get('month'), invoiceDict.get('name'), invoiceDict.get('rate'), invoiceDict.get('comments'), invoiceDict.get('sessions'))
        newInvoice.openTemplate()
        newInvoice.fillInvoice()
        #passes invoiceDict information to invoice creation
        newInvoiceDB = summary.summaryInvoice()
        newInvoiceDB.createSeasonTable(invoiceDict.get('season'))
        newInvoiceDB.insertNewInvoice(invoiceDict.get('season'), invoiceDict.get('month'), newInvoice.getInvoiceOutputPath())
        newInvoiceDB.fillSeasonTable(invoiceDict.get('season'), invoiceDict.get('month'), invoiceDict.get('sessions'))
        del newInvoiceDB
        return jsonify({"success": "true", "invoice" : newInvoice.getInvoiceOutputPath()}), 201
    except Exception as e:
        return jsonify({"success": "false", "error": str(e)}), 500

@app.route("/invoice/<path:filename>", methods=["GET","POST"])
def download(filename):
    path = "invoice\\"+filename
    return send_file(path, as_attachment=True)

    return request.url_root

@app.route("/summaryInvoice", methods=["GET"])
def summaryInvoice():
    try:
        newInvoiceDB = summary.summaryInvoice()
        table = newInvoiceDB.showTable()
        del newInvoiceDB
        return jsonify({"success":"true", "invoiceTable": table}), 200
    except Exception as e:
        return jsonify({"success": "false", "error": str(e)}), 500

@app.route("/getInvoice", methods=["GET"])
def getInvoice():
    try:
        season = request.headers["season"]
        newInvoiceDB = summary.summaryInvoice()
        table = newInvoiceDB.getSeasonTable(season)
        del newInvoiceDB
        return jsonify({"success":"true", "seasonTable": table})
    except Exception as e:
        if e.errno == errorcode.ER_NO_SUCH_TABLE:
            return jsonify({"success": "true", "seasonTable": 0}), 200
        else:
            return jsonify({"success": "false", "error": str(e)}), 500

@app.route("/sortInvoice", methods=["GET"])
def sortInvoice():
    try:
        season = request.headers["season"]
        header = request.headers["header"]
        order = request.headers["order"]
        newInvoiceDB = summary.summaryInvoice()
        table = newInvoiceDB.getSortedSeasonTable(season, header, order)
        del newInvoiceDB
        return jsonify({"success":"true", "sortedTable": table})
    except Exception as e:
        return jsonify({"success": "false", "error": str(e)}), 500

@app.route("/importInvoice", methods=["POST"])
def importInvoice():
    try:
        file = request.files['inputInvoice']
        filename = (secure_filename(file.filename))
        file.save(os.path.join(app.config['UPLOAD_FOLDER'],filename))
        uploadInvoice = upload.invoiceUpload(filename)
        season = uploadInvoice.getSeason()
        uploadInvoice.openUploadedFile()
        uploadInfo = uploadInvoice.getUploadedInvoiceInfo()
        #print(uploadInfo)
        uploadCalendar = uploadInvoice.getCalendar()
        #print(uploadCalendar)
        uploadInvoice.updateDatabase()
        return jsonify({"success": "true", "season": season, "uploadInfo": uploadInfo, "uploadCalendar": uploadCalendar}), 200
    except Exception as e:
        return jsonify({"success": "false", "error": str(e)}), 500

@app.route("/updateImport", methods=["POST"])
def updateImport():
    #Add comments later
    #comments = request.args.get("comments")
    data = json.loads(request.data, strict=False)
    season = data["season"]
    month = data["month"]
    listSessions = data["sessions"]
    listSessionsAmount = data["amount"]
    listSessionsDate = data["date"]
    comments = data["comments"]
    name = data["name"]
    rate = data["rate"]

    numberSessions = len(listSessions)
    numberAmount = len(listSessionsAmount)
    numberDate = len(listSessionsDate)

    #raise 400 if session data array doesn't have the same length
    if (numberAmount != numberSessions or numberSessions != numberDate):
        abort(400, description="Sessions has missing data "+ str({"session-type": listSessions, "sessions-amount": listSessionsAmount, "date-of-session": listSessionsDate}))
    elif (numberAmount == 0 or numberSessions == 0 or numberDate == 0):
        abort(400, description= "Empty query")

    sessions = {}
    #creating dict of sessions
    for x in range (numberSessions):
        sessions["session"+str(x)] = {"type": listSessions[x], "amount": listSessionsAmount[x], "date": listSessionsDate[x]}

    if comments == None:
        comments = ""

    updateInvoiceDict = {
        "season": season,
        "month": month,
        "comments": comments,
        "sessions": sessions,
        "name": name,
        "rate": rate
    }

    newInvoice = invoice.createInvoice(updateInvoiceDict.get('season'), updateInvoiceDict.get('month'), updateInvoiceDict.get('name'), updateInvoiceDict.get('rate'), updateInvoiceDict.get('comments'), updateInvoiceDict.get('sessions'))
    newInvoice.openTemplate()
    newInvoice.fillInvoice()
    #passes updateInvoiceDict information to invoice creation
    newInvoiceDB = summary.summaryInvoice()
    newInvoiceDB.createSeasonTable(updateInvoiceDict.get('season'))
    newInvoiceDB.insertNewInvoice(updateInvoiceDict.get('season'), updateInvoiceDict.get('month'), newInvoice.getInvoiceOutputPath())
    newInvoiceDB.fillSeasonTable(updateInvoiceDict.get('season'), updateInvoiceDict.get('month'), updateInvoiceDict.get('sessions'))
    del newInvoiceDB
    return jsonify({"success": "true", "invoice" : newInvoice.getInvoiceOutputPath()}), 201

@app.route("/deleteInvoice", methods=["POST"])
def deleteInvoice():
    data = json.loads(request.data, strict=False)
    parm = data["parms"]
    season = parm.split(" ")[0]
    month = parm.split(" ")[1]

    delInvoice = summary.summaryInvoice()
    delInvoice.deleteInvoice(season,month)

    del delInvoice

    return jsonify({"success": "true", }), 201

if __name__ == "__main__":
    app.run(debug=True)
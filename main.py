from flask import Flask, abort, render_template, request, jsonify, send_file
import static.python.invoiceCreation as invoice
import static.python.invoiceSummary as summary

app = Flask(__name__, template_folder='templates')

"""
TODO
- Add check when creating invoice for a season and month that already exists
- Add update/edit function for an existing invoice
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
        return jsonify({"success": "true", "invoice" : newInvoice.getInvoiceOutputPath()}), 201
    except Exception as e:
        return jsonify({"success": "false", "error": str(e)}), 500

@app.route("/invoice/<path:filename>", methods=["GET","POST"])
def download(filename):
    path = "invoice\\"+filename
    return send_file(path, as_attachment=True)

def getUrl():
    return request.url

def getUrlRoot():
    return request.url_root

@app.route("/summaryInvoice", methods=["GET"])
def summaryInvoice():
    try:
        newInvoiceDB = summary.summaryInvoice()
        table = newInvoiceDB.showTable()
        return jsonify({"success":"true", "invoiceTable": table})
    except Exception as e:
        return jsonify({"success": "false", "error": str(e)}), 500

@app.route("/getInvoice", methods=["GET"])
def getInvoice():
    try:
        season = request.headers["season"]
        newInvoiceDB = summary.summaryInvoice()
        table = newInvoiceDB.getSeasonTable(season)
        return jsonify({"success":"true", "seasonTable": table})
    except Exception as e:
        return jsonify({"success": "false", "error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
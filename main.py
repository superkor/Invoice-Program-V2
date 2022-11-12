from flask import Flask, render_template, request, abort

app = Flask(__name__, template_folder='templates')
app.config['SECRET_KEY'] = 'dd1cfcfaef07bc9acd8d4d6923e9624caafae611169423ff'

@app.route("/")
def home():
    return render_template('index.html', result = [])

@app.route("/create", methods=["GET"])
def createInvoice():
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

    sessions = {}
    #creating dict of sessions
    for x in range (numberSessions):
        sessions["session"+str(x)] = {"type": listSessions[x], "amount": listSessionsAmount[x], "date": listSessionsDate[x]}

    if comments == None:
        comments = ""

    return render_template('index.html', result=[season,month,name,rate, comments, sessions])

@app.errorhandler(400)
def serverError(e):
    return render_template("400.html", error = e), 400
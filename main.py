from flask import Flask, render_template, request

app = Flask(__name__, template_folder='templates')
app.config['SECRET_KEY'] = 'dd1cfcfaef07bc9acd8d4d6923e9624caafae611169423ff'

@app.route("/")
def home():
    return render_template('index.html')

@app.route("/create", methods=["GET"])
def createInvoice():
    season = request.args.get('season')
    month = request.args.get('month')
    name=request.args.get("name")
    rate=request.args.get("rate")
    return render_template('create.html', result=[season,month,name,rate])

import openpyxl as invoice
from openpyxl import load_workbook
import shutil
import datetime as date

class createInvoice:
    invoiceTemplatePath = "././invoice/template"
    invoiceOutputPath = "././invoice/output"
    monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    sessionMins = {
        "PCS": 50,
        "CS": 30,
        "IN": 10,
        "PEP": 30,
        "AD": 50,
        "PW": 60,
        "ST": 10,
        "FZ": 15,
        "NV": 10,
        "JR": 15,
        "CIR": 5,
        "RPT": 10
    }
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
    year = 0

    def __init__(self, season, month, name, rate, comments, sessions):
        self.season = season
        self.month = month
        self.name = name
        self.rate = rate
        self.comments = comments
        self.sessions = sessions

    def getYear(self):
        month = self.monthArray.index(self.month)
        if (month >= 9):
            self.year = self.season.split('-')[0]
        else:
            self.year = self.season.split('-')[1]
    
    def openTemplate(self):
        self.getYear()
        self.invoiceOutputPath = self.invoiceOutputPath+"/"+f"{self.month} {self.year} Invoice.xlsx"
        shutil.copyfile(self.invoiceTemplatePath+"/"+f"{self.season}.xlsx", self.invoiceOutputPath)

    def setValues(self):
        numberSessions = len(self.sessions)
        for x in range(numberSessions):
            if self.sessions[f"session{x}"]["type"] == "PCS":
                self.pcs+=int(self.sessions[f"session{x}"]["amount"])
            elif self.sessions[f"session{x}"]["type"] == "CS":
                self.cs+=int(self.sessions[f"session{x}"]["amount"])
            elif self.sessions[f"session{x}"]["type"] == "FZ":
                self.fz+=int(self.sessions[f"session{x}"]["amount"])
            elif self.sessions[f"session{x}"]["type"] == "NV":
                self.nv+=int(self.sessions[f"session{x}"]["amount"])
            elif self.sessions[f"session{x}"]["type"] == "JR":
                self.jr+=int(self.sessions[f"session{x}"]["amount"])
            elif self.sessions[f"session{x}"]["type"] == "PEP":
                self.pep+=int(self.sessions[f"session{x}"]["amount"])
            elif self.sessions[f"session{x}"]["type"] == "AD":
                self.ad+=int(self.sessions[f"session{x}"]["amount"])
            elif self.sessions[f"session{x}"]["type"] == "PW":
                self.pw+=int(self.sessions[f"session{x}"]["amount"])
            elif self.sessions[f"session{x}"]["type"] == "ST":
                self.st+=int(self.sessions[f"session{x}"]["amount"])
            elif self.sessions[f"session{x}"]["type"] == "CIR":
                self.cir+=int(self.sessions[f"session{x}"]["amount"])
            elif self.sessions[f"session{x}"]["type"] == "RPT":
                self.rpt+=int(self.sessions[f"session{x}"]["amount"])
            elif self.sessions[f"session{x}"]["type"] == "IN":
                self.inter+=int(self.sessions[f"session{x}"]["amount"])
            
    def fillInvoice(self):
        #to create logic in setting values from site to excel (must check season and have correct template)
        newInvoice = load_workbook(filename = self.invoiceOutputPath)
        newInvoice.active = newInvoice["Timesheet"]
        wb = newInvoice.active
        wb["J5"] = self.name
        wb["J7"] = self.rate
        if self.season == "2022-2023":
            #fill invoice based on 2022-2023 template
            self.setValues()
            if self.pcs > 0:
                wb["C23"] = self.pcs
            if self.cs > 0:
                wb["C24"] = self.cs
            if self.fz > 0:
                wb["C25"] = self.fz
            if self.nv > 0:
                wb["C26"] = self.nv
            if self.jr >0:
                wb["C27"] = self.jr
            if self.pep >0:
                wb["C28"] = self.pep
            if self.ad >0:
                wb["C29"] = self.ad
            if self.pw >0:
                wb["C30"] = self.pw
            if self.st >0:
                wb["C31"] = self.st
            if self.cir >0:
                wb["C32"] = self.cir
            if self.rpt >0:
                wb["C32"] = self.rpt 
        else:
            #fill invoice based on 2019-2020 template for years 2019-2022
            self.setValues()
            if self.pcs > 0:
                wb["C20"] = self.pcs
            if self.cs > 0:
                wb["C21"] = self.cs
            if self.inter > 0:
                wb["C22"] = self.inter
            if self.pep >0:
                wb["C23"] = self.pep
            if self.ad >0:
                wb["C24"] = self.ad
            if self.pw >0:
                wb["C25"] = self.pw
            if self.st >0:
                wb["C26"] = self.st

        #wb["J20"] = self.comments

        newInvoice.save(filename = self.invoiceOutputPath)
        self.fillCalendar()

    def fillCalendar(self):
        #to create logic in creating the calendar in the other spreadsheet and to fill in correct and respective worked session dates
        newInvoice = load_workbook(filename = self.invoiceOutputPath)
        newInvoice.active = newInvoice["Calendar"]
        wb = newInvoice.active

        wb["E7"] = self.month

        #get first day of the month
        firstDay = date.datetime(int(self.year), self.monthArray.index(self.month)+1, 1).weekday()
        
        self.setFirstDay(firstDay,wb)

        newInvoice.save(filename = self.invoiceOutputPath)

    def setFirstDay(self, firstDay,wb):
        if firstDay == 0:
            wb["C9"] = 1
        elif firstDay == 1:
            wb["D9"] = 1
        elif firstDay == 2:
            wb["E9"] = 1
        elif firstDay == 3:
            wb["F9"] = 1
        elif firstDay == 4:
            wb["G9"] = 1
        elif firstDay == 5:
            wb["H9"] = 1
        elif firstDay == 6:
            wb["B9"] = 1


    
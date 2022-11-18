import openpyxl as invoice
import shutil,os

class createInvoice:
    invoiceTemplatePath = "././invoice/template"
    invoiceOutputPath = "././invoice/output"
    monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    def __init__(self, season, month, name, rate, comments, sessions):
        self.season = season
        self.month = month
        self.name = name
        self.rate = rate
        self.comments = comments
        self.sessions = sessions

    def getYear(self):
        month = self.monthArray.index(self.month)
        if (month < 9):
            year = self.season.split('-')[0]
        else:
            year = self.season.split('-')[1]
        return year
    
    def openTemplate(self):
        year = self.getYear()
        self.invoiceOutputPath = self.invoiceOutputPath+"/"+f"{self.month} {year} Invoice.xlsx"
        shutil.copyfile(self.invoiceTemplatePath+"/"+f"{self.season}.xlsx", self.invoiceOutputPath)

    def fillInvoice(self):
        #to create logic in setting values from site to excel (must check season and have correct template)
        pass

    def fillCalendar(self):
        #to create logic in creating the calendar in the other spreadsheet and to fill in correct and respective worked session dates
        pass



    
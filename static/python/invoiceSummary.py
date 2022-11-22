import mysql.connector

class summaryInvoice:
    def __init__(self):
        try:
            self.mydb = mysql.connector.connect(
            host="localhost",
            port=3306,
            user="user",
            password=""
            )
            self.mycursor = self.mydb.cursor()
        except mysql.connector.Error as err:
            raise err
    
    """
    Creates a new row into the list_invoice table. 
    Arguments:
    season: string (up to 255 characters)
    month: string (up to 255 characters)
    link: string (up to 255 characters)
    """
    def insertNewInvoice(self, season, month, link):
        try:
            insertInvoice = """
                INSERT INTO list_invoices VALUES (%s, %s, %s)   
            """
            self.mycursor.execute("use invoices")
            self.mycursor.execute(insertInvoice, (season, month, link))
            self.mydb.commit()
        except mysql.connector.Error as err:
            raise err

    """
    Gets the invoice file link based on season and month stored in the invoices database list_invoice table. Returns listed tuple.
    """
    def getInvoiceLink(self, season, month):
        try:
            selectRow = """
            SELECT link FROM list_invoices WHERE season = %s AND months = %s
            """
            self.mycursor.execute("use invoices")
            self.mycursor.execute(selectRow, (season, month))
            #print(self.mycursor.fetchall())
            return self.mycursor.fetchall()
        except mysql.connector.Error as err:
            raise err
    
    """
    Returns the list_invoice table from the invoices database as a listed tuple.
    """
    def showTable(self):
        try:
            self.mycursor.execute("USE invoices")
            self.mycursor.execute("SELECT * FROM list_invoices")
            return self.mycursor.fetchall()
        except mysql.connector.Error as err:
                raise err


if __name__ == "__main__":
    sql = summaryInvoice()
    #sql.insertNewInvoice("2019-2020", "December", "link2")
    test = sql.getInvoiceLink("2019-2020", "November")
    sql.showTable()
    print(test[0][0])
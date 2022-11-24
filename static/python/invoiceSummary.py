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
    Checks if a record exists in a table.
    Arguments:
    table: int (0 is list_invoices, 1 is using season) 
    season: string
    months: string
    Returns 1 if there is a record existing and returns 0 if there isn't.
    """
    def checkIfRecordExists(self, season: str, table: int, months: str):
        try:
            self.mycursor.execute("use invoices")
            if not table:
                selectTable = """
                SELECT 1 WHERE EXISTS (SELECT * FROM list_invoices WHERE season = %s AND months = %s)
                """
                self.mycursor.execute(selectTable, (season, months))
                num = self.mycursor.fetchone()
            else:
                selectTable = """
                SELECT 1 WHERE EXISTS (SELECT * FROM `%s` WHERE months = %s)
                """
                self.mycursor.execute(selectTable, (season, months))
                num = self.mycursor.fetchone()
            if num != None:
                return 1
            else:
                return 0
        except mysql.connector.Error as err:
            raise err

    """
    Creates a new row into the list_invoice table. 
    Arguments:
    season: string (up to 255 characters)
    month: string (up to 255 characters)
    link: string (up to 255 characters)
    """
    def insertNewInvoice(self, season: str, month: str, link: str):
        try:
            if not self.checkIfRecordExists(season, 0, month):
                insertInvoice = """
                    INSERT INTO list_invoices VALUES (%s, %s, %s)   
                """
                self.mycursor.execute(insertInvoice, (season, month, link))
                self.mydb.commit()
        except mysql.connector.Error as err:
            raise err

    """
    Gets the invoice file link based on season and month stored in the invoices database list_invoice table. Returns listed tuple.
    """
    def getInvoiceLink(self, season: str, month: str):
        try:
            selectRow = """
            SELECT link FROM list_invoices WHERE season = %s AND months = %s
            """
            self.mycursor.execute("use invoices")
            self.mycursor.execute(selectRow, (season, month))
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

    """
    Returns Season Table
    Arguments:
    season: string (up to 255 characters)
    """
    def getSeasonTable(self, season: str):
        try:
            self.mycursor.execute("USE invoices")
            selectTable = """
            SELECT * FROM `%s`
            """
            self.mycursor.execute(selectTable, (season,))
            result = self.mycursor.fetchall()
            if len(result) == 0:
                return [""]
            else:
                return result
        except mysql.connector.Error as err:
            raise err
    
    """
    Creates table per season to store session data and total amount.
    Arguments:
    season: string (up to 255 characters)
    """
    def createSeasonTable(self, season: str):
        try:
            self.mycursor.execute("USE invoices")
            selectTable = """
            SELECT COUNT(TABLE_NAME) FROM information_schema.TABLES WHERE TABLE_NAME = ''%s'' AND TABLE_SCHEMA LIKE 'invoices';
            """
            self.mycursor.execute(selectTable, (season,))
            num = self.mycursor.fetchone()
            if num[0] == 0:
                createTable = """
                    CREATE TABLE `%s` (months varchar(255), PCS int, CS int, FZ int, NV int, JR int, PEP int, AD int, PW int, ST int, CIR int, RPT int, INTER int)
                """
                self.mycursor.execute(createTable, (season,))
                self.mydb.commit()
        except mysql.connector.Error as err:
            raise err

    """
    Fills season table with session data.
    Arguments:
    season: string (up to 255 characters)
    sessionData: dict (up to 12 keys)
    """
    def fillSeasonTable(self, season: str, months: str, sessions: dict):
        try:
            if not self.checkIfRecordExists(season, 1, months):
                self.mycursor.execute("USE invoices")
                insertIntoTable = """
                INSERT INTO `%s` VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)   
                """
                pcs = cs = fz = nv = jr = pep = ad = pw = st = cir = rpt = inter = 0

                numberSessions = len(sessions)
                for x in range(numberSessions):
                    if sessions[f"session{x}"]["type"] == "PCS":
                        pcs+=int(sessions[f"session{x}"]["amount"])
                    elif sessions[f"session{x}"]["type"] == "CS":
                        cs+=int(sessions[f"session{x}"]["amount"])
                    elif sessions[f"session{x}"]["type"] == "FZ":
                        fz+=int(sessions[f"session{x}"]["amount"])
                    elif sessions[f"session{x}"]["type"] == "NV":
                        nv+=int(sessions[f"session{x}"]["amount"])
                    elif sessions[f"session{x}"]["type"] == "JR":
                        jr+=int(sessions[f"session{x}"]["amount"])
                    elif sessions[f"session{x}"]["type"] == "PEP":
                        pep+=int(sessions[f"session{x}"]["amount"])
                    elif sessions[f"session{x}"]["type"] == "AD":
                        ad+=int(sessions[f"session{x}"]["amount"])
                    elif sessions[f"session{x}"]["type"] == "PW":
                        pw+=int(sessions[f"session{x}"]["amount"])
                    elif sessions[f"session{x}"]["type"] == "ST":
                        st+=int(sessions[f"session{x}"]["amount"])
                    elif sessions[f"session{x}"]["type"] == "CIR":
                        cir+=int(sessions[f"session{x}"]["amount"])
                    elif sessions[f"session{x}"]["type"] == "RPT":
                        rpt+=int(sessions[f"session{x}"]["amount"])
                    elif sessions[f"session{x}"]["type"] == "IN":
                        inter+=int(sessions[f"session{x}"]["amount"])
                self.mycursor.execute(insertIntoTable, (season, months, pcs, cs, fz, nv, jr, pep, ad, pw, st, cir, rpt, inter))
                self.mydb.commit() 
            #if month is already in table
            else:
                self.mycursor.execute("USE invoices")
                insertIntoTable = """
                UPDATE `%s` SET PCS = %s, CS = %s, FZ = %s, NV = %s, JR = %s, PEP = %s, AD = %s, PW = %s, ST = %s, CIR = %s, RPT = %s, INTER = %s WHERE months = %s   
                """
                pcs = cs = fz = nv = jr = pep = ad = pw = st = cir = rpt = inter = 0

                numberSessions = len(sessions)
                for x in range(numberSessions):
                    if sessions[f"session{x}"]["type"] == "PCS":
                        pcs+=int(sessions[f"session{x}"]["amount"])
                    elif sessions[f"session{x}"]["type"] == "CS":
                        cs+=int(sessions[f"session{x}"]["amount"])
                    elif sessions[f"session{x}"]["type"] == "FZ":
                        fz+=int(sessions[f"session{x}"]["amount"])
                    elif sessions[f"session{x}"]["type"] == "NV":
                        nv+=int(sessions[f"session{x}"]["amount"])
                    elif sessions[f"session{x}"]["type"] == "JR":
                        jr+=int(sessions[f"session{x}"]["amount"])
                    elif sessions[f"session{x}"]["type"] == "PEP":
                        pep+=int(sessions[f"session{x}"]["amount"])
                    elif sessions[f"session{x}"]["type"] == "AD":
                        ad+=int(sessions[f"session{x}"]["amount"])
                    elif sessions[f"session{x}"]["type"] == "PW":
                        pw+=int(sessions[f"session{x}"]["amount"])
                    elif sessions[f"session{x}"]["type"] == "ST":
                        st+=int(sessions[f"session{x}"]["amount"])
                    elif sessions[f"session{x}"]["type"] == "CIR":
                        cir+=int(sessions[f"session{x}"]["amount"])
                    elif sessions[f"session{x}"]["type"] == "RPT":
                        rpt+=int(sessions[f"session{x}"]["amount"])
                    elif sessions[f"session{x}"]["type"] == "IN":
                        inter+=int(sessions[f"session{x}"]["amount"])
                self.mycursor.execute(insertIntoTable, (season, pcs, cs, fz, nv, jr, pep, ad, pw, st, cir, rpt, inter, months))
                self.mydb.commit() 
            
        except mysql.connector.Error as err:
            raise err

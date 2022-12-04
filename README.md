# Invoice-Program-V2

A simple Flask-based web application to automate the creation, updating (through uploading), and calculating statistics based on created and uploaded invoices.

This application uses the Flask web framework, JQuery, MySQL, and custom python APIs used to interface and interact with openpyxl (to create and update invoices) and with SQL databases.

There are two SQL tables being used: `list_invoices` and tables named based on the season.

list_invoices table displays all invoices created and invoices uploaded, and then updated, through the application. Each row contains their respective season and month the invoice is for and their file download link.

![Sample list_invoices table](https://github.com/superkor/Invoice-Program-V2/blob/main/images/list_invoices.png)

The second table type is for holding session total data, separated into their respective season.

An example is the 2022-2023 table that holds all invoices created and updated through the application. Each row contains total sessions for each type of possible sessions that can be on the invoice (PCS, CS, FZ, NV, JR, PEP, AD, PW, ST, CIR, RPT, INTER). The Hours column is simply the total hours spent working in that month based on the total number of sessions worked.

![Sample `'2022-2023'` table](https://github.com/superkor/Invoice-Program-V2/blob/main/images/2022-2023_table.png)

- User is able to create invoices through this application to automate the tedious tasks of filling in the invoice and timesheet. Program will automatically select the correct template that is correct for the season and fill in the information given by user. All created invoices will be added to a database to be displayed to show the summary of invoices and some data analysis.
- improves intial invoice program by adding in summary of created invoices (adding in some analytical data into it)
- uses python (using flask framework), html/css/js, and sql to store created invoices

# Invoice-Program-V2

A simple Flask-based web application to automate the creation, updating (through uploading), and calculating statistics based on created and uploaded invoices.

This application uses the Flask web framework, JQuery, MySQL, and custom python APIs used to interface and interact with openpyxl (to create and update invoices) and with SQL databases.

There are two SQL tables being used: `list_invoices` and tables named based on the season.

list_invoices table displays all invoices created and invoices uploaded, and then updated, through the application. Each row contains their respective season and month the invoice is for and their file download link.

![Sample list_invoices table](https://github.com/superkor/Invoice-Program-V2/blob/main/images/list_invoices.png)

The second table type is for holding session total data, separated into their respective season.

An example is the 2022-2023 table that holds all invoices created and updated through the application. Each row contains total sessions for each type of possible sessions that can be on the invoice (PCS, CS, FZ, NV, JR, PEP, AD, PW, ST, CIR, RPT, INTER). The Hours column is simply the total hours spent working in that month based on the total number of sessions worked.

![Sample `'2022-2023'` table](https://github.com/superkor/Invoice-Program-V2/blob/main/images/2022-2023_table.png)

## Usage

Required libraries: Flask, mysql.connector, werkzeug, openpyxl, shutil, jQuery. Also requires MySQL (using MySQL Server 8.0).

Run ```python -m flask -app main run``` at the root of the project to start the flask server. 

In the bin folder of the MySQL Server folder, run ```mysqld --console``` to start the sql server.

Open the local webpage as seen in the python console (usually 127.0.0.1:5000).

## Creating an Invoice

Opening the web application will show the Invoice Creation tab.

(https://github.com/superkor/Invoice-Program-V2/blob/main/images/createpage.png)

The default prompts are shown: season, month, name, hourly rate, comments, and session.

Season will contain the available seasons the invoices can be made towards, 2019-2020, 2020-2021, 2021-2022, 2022-2023.

> :exclamation: **Note**: by choosing 2022-2023, the "INTER" (Intermediate) session will not be available to be selected and the CIR, RPT, NV, JR, and ST sessions will be available. By choosing any other season, vice versa will occur.

Month has all of the months in a year.

The Name input box is where you can enter your name.

Hourly Rate only accepts a number (where you enter your hourly rate).

Comments is a multiline input that allows you to enter any comments onto the invoice.

###Sessions

Based on the season, the dropdown will show possible sessions that can be selected. Each row represents a session type performed in a day.

For example, doing a "Fun Zone" session twice in a day on Jan 18, 2023 should be inputed like:
(https://github.com/superkor/Invoice-Program-V2/blob/main/images/sessionExample.png)

Clicking on `Add Session` will add another row to add another session input.

The Date selector on each session row will be locked to the month and season you have selected. Months September to December will take the first year in the season. January to August will take the second year in the season. For example Decemeber in season 2022-2023 will be Dec 2022 but May in season 2022-2023 will be May 2023.

![A sample invoice request will look like this](https://github.com/superkor/Invoice-Program-V2/blob/main/images/samplerequest.png)

![Click `Submit` will lead to a confirmation page](https://github.com/superkor/Invoice-Program-V2/blob/main/images/confirminput.png)

Click Confirm to create the invoice with inputs entered.

Upon clicking confirm and when the invoice has been created, user will be redirected back to root with a notification at the top of the page with a download link to the created invoice:

(https://github.com/superkor/Invoice-Program-V2/blob/main/images/invoicecreated.png)

The created invoice (server side) is located in `invoice/output`. Invoice file name will be `{Month} {Year} Invoice.xslx`, with the year based on the season and month selected.

### Viewing the Created Invoice

In the created invoice file, the timesheet and calendar has been filled in with the information:

(https://github.com/superkor/Invoice-Program-V2/blob/main/images/sampleinvoice.png)
(https://github.com/superkor/Invoice-Program-V2/blob/main/images/samplecal.png)

The calendar will automatically fill in the sessions and amount done in a day.

### Viewing the SQL database

In the `list_invoices` table, the created invoice will be shown: (https://github.com/superkor/Invoice-Program-V2/blob/main/images/samplelist_invoice.png)

In the season `2022-2023` table, the total sessions done will be shown: (https://github.com/superkor/Invoice-Program-V2/blob/main/images/sampleseason.png)


- User is able to create invoices through this application to automate the tedious tasks of filling in the invoice and timesheet. Program will automatically select the correct template that is correct for the season and fill in the information given by user. All created invoices will be added to a database to be displayed to show the summary of invoices and some data analysis.
- improves intial invoice program by adding in summary of created invoices (adding in some analytical data into it)
- uses python (using flask framework), html/css/js, and sql to store created invoices

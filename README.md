# Invoice-Program-V2

A simple Flask-based web application to automate the creation, updating (through uploading), and calculating statistics based on created and uploaded invoices.

This application uses the Flask web framework, JQuery, MySQL, and custom python APIs used to interface and interact with openpyxl (to create and update invoices) and with SQL databases.

## Usage

Required libraries: Flask, mysql.connector, werkzeug, openpyxl, shutil, jQuery. Also requires MySQL (using MySQL Server 8.0).

Run ```python -m flask -app main run``` at the root of the project to start the flask server. 

In the bin folder of the MySQL Server folder, run ```mysqld --console``` to start the sql server (must be running cmd as admin).

Open the local webpage as seen in the python console (usually 127.0.0.1:5000).

## Creating an Invoice

Opening the web application will show the Invoice Creation tab
![Create](https://github.com/superkor/Invoice-Program-V2/blob/main/images/createpage.png)

The default prompts are shown: season, month, name, hourly rate, comments, and session.

Season will contain the available seasons the invoices can be made towards, 2019-2020, 2020-2021, 2021-2022, 2022-2023.

> **Note**: by choosing 2022-2023, the "INTER" (Intermediate) session will not be available to be selected and the CIR, RPT, NV, JR, and ST sessions will be available. By choosing any other season, vice versa will occur.

Month has all of the months in a year.

The Name input box is where you can enter your name.

Hourly Rate only accepts a number (where you enter your hourly rate).

Comments is a multiline input that allows you to enter any comments onto the invoice.

### Sessions

Based on the season, the dropdown will show possible sessions that can be selected. Each row represents a session type performed in a day.

For example, doing a "Fun Zone" session twice in a day on Jan 18, 2023 should be inputed like:
![Session Example](https://github.com/superkor/Invoice-Program-V2/blob/main/images/sessionExample.png)

Clicking on `Add Session` will add another row to add another session input for the same day. Clicking on `Add Day` will add another box to add sessions done on a different day.

The Date selector on each session row will be locked to the month and season you have selected. Months September to December will take the first year in the season. January to August will take the second year in the season. For example Decemeber in season 2022-2023 will be Dec 2022 but May in season 2022-2023 will be May 2023.

![A sample invoice request will look like this](https://github.com/superkor/Invoice-Program-V2/blob/main/images/samplerequest.png)

Upon clicking Submit and when the invoice has been created, user will be redirected back to root with a notification at the top of the page with a download link to the created invoice:
![Confirm Example](https://github.com/superkor/Invoice-Program-V2/blob/main/images/invoicecreated.png)

The created invoice (server side) is located in `invoice/output`. Invoice file name will be `{Month} {Year} Invoice.xlxx`, with the year based on the season and month selected.

### Viewing the Created Invoice

In the created invoice file, the timesheet and calendar has been filled in with the information:

![sample timesheet](https://github.com/superkor/Invoice-Program-V2/blob/main/images/sampleinvoice.png)
![sample calendar](https://github.com/superkor/Invoice-Program-V2/blob/main/images/samplecal.png)

The calendar will automatically fill in the sessions and amount done in a day.

### Viewing the SQL database

In the `list_invoices` table, the created invoice will be shown:
![list_invoices table example](https://github.com/superkor/Invoice-Program-V2/blob/main/images/samplelist_invoice.png)

In the season `2022-2023` table, the total sessions done will be shown:
![2022-2023 table example](https://github.com/superkor/Invoice-Program-V2/blob/main/images/sampleseason.png)

### Uploading an Invoice

Under the `Import Invoice` tab, a prompt allows a user to upload a valid invoice.
![Import Invoice Page](https://github.com/superkor/Invoice-Program-V2/blob/main/images/importpage.png)

Uploading an invoice will automatically get the information from the invoice and display it to the user to allow them to update the invoice. Uploading the invoice (with or without modification) will update the SQL table.
![Sample Import Invoice Page](https://github.com/superkor/Invoice-Program-V2/blob/main/images/sampleimport.png)

### Summary of Invoices

Under the `Summary of Invoices` tab, user is shown season buttons to view summary of all uploaded and created invoices.
![Summary of Invoices Page](https://github.com/superkor/Invoice-Program-V2/blob/main/images/summarypage.png)

Clicking on `2022-2023` will show a table of months and their respective number of sessions, a graph showing the amonut of sessions per month, and options to downloading, deleting, and updating an invoice.
![Summary 1](https://github.com/superkor/Invoice-Program-V2/blob/main/images/summary1.png)
![Summary 2](https://github.com/superkor/Invoice-Program-V2/blob/main/images/summary2.png)

Clicking `Update Invoice` will redirect to the Import Invoice tab with the selected invoice's information.
![Update Example](https://github.com/superkor/Invoice-Program-V2/blob/main/images/updateinvoice.png)

Clicking on `Click Here to access {Season} {Month} Invoice` will download the invoice file.

Clicking on `Delete Invoice` under a specific month will delete the invoice from the server and all tables in the database.
const mysql = require('mysql');
const inquirer = require('inquirer');
const {table} = require('table');
const chalk = require('chalk');

const sqlConnection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});

sqlConnection.connect( function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    // console.log('connected as id ' + sqlConnection.threadId);
});

const start = function() {
    inquirer.prompt(
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: 
            [
                'View Product Sales by Department',
                'Create New Department',
                'Quit'
            ]
        }
    )
    .then( answers => {
        var action = answers.action;
        switch (action) {
            case 'View Product Sales by Department':
                return printItemList();
                break;

            case 'Create New Department':
                return printLowInventory();
                break;

            case 'Quit':
                sqlConnection.end();    
                process.exit(0);
                break;
        
            default:
                break;
        }
    })
    .catch( result => {
        console.log(result);
        console.log();
    })
    .then( result => {
        start();
    });
}

const viewProductSalesByDepartment = function () {
    return new Promise( (resolve, reject) => {

    });
}

const printItemList = function () {
    return new Promise( (resolve, reject) => {
        sqlConnection.query("SELECT * FROM products", function (err, res) {
            if (err) reject(Error(err));
            // Log all results of the SELECT statement
            var data = [];
            data.push(
                [
                    chalk.underline.bold('ID'),
                    chalk.underline.bold('Name'),
                    chalk.underline.bold('Department Name'),
                    chalk.underline.bold('Price'),
                    chalk.underline.bold('Stock')
                ]
            );
            res.forEach(element => {
                data.push(
                    [
                        element.item_id,
                        element.product_name,
                        element.department_name,
                        element.price,
                        element.stock_quantity
                    ]
                );
            });
            console.log(table(data));
            resolve();
        });
    })
}

start();
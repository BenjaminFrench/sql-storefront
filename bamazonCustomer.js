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

const start = function() {
    // inquirer.prompt()
    printItemList();
    sqlConnection.end();
}

const printItemList = function() {
    sqlConnection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
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
    });
}

start();
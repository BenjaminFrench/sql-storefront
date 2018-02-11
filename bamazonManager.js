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
                'View Products for Sale',
                'View Low Inventory',
                'Add to Inventory',
                'Add New Product',
                'Quit'
            ]
        }
    )
    .then( answers => {
        var action = answers.action;
        switch (action) {
            case 'View Products for Sale':
                return printItemList();
                break;

            case 'View Low Inventory':
                return printLowInventory();
                break;

            case 'Add to Inventory':
                return addToInventory();
                break;

            case 'Add New Product':
                return addNewProduct();
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

const addNewProduct = function() {
    return new Promise( (resolve, reject) => {
        inquirer.prompt(
            [
                {
                    type: 'input',
                    name: 'itemName',
                    message: 'New Item name.'
                },
                {
                    type: 'input',
                    name: 'itemDepartment',
                    message: 'New item department'
                },
                {
                    type: 'input',
                    name: 'itemQuantity',
                    message: 'New Item quantity.'
                },
                {
                    type: 'input',
                    name: 'itemPrice',
                    message: 'New Item price.'
                }
            ]
        )
        .then( answers => { 
            sqlConnection.query("INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)", [answers.itemName, answers.itemDepartment, answers.itemPrice, answers.itemQuantity], function (err, res) {
                if (err) reject(Error(err));

                if (res.affectedRows < 1) return reject('Item not added.');

                console.log(res.affectedRows + ' items added');
                resolve();
            });
        });
    });
}

const addToInventory = function() {
    return new Promise( (resolve, reject) => {
        inquirer.prompt(
            [
                {
                    type: 'input',
                    name: 'itemID',
                    message: 'Please enter the ID of the item you would like to update.'
                },
                {
                    type: 'input',
                    name: 'itemQuantity',
                    message: 'Please enter quantity you would like to add.'
                }
            ]
        )
        .then( answers => { 
            sqlConnection.query("UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?", [answers.itemQuantity, answers.itemID], function (err, res) {
                if (err) reject(Error(err));

                if (res.changedRows < 1) return reject('Item ID not found.');

                console.log(res.changedRows + ' items updated');
                resolve();
            });
        });
    });
}

const printLowInventory = function() {
    return new Promise( (resolve, reject) => {
        sqlConnection.query("SELECT * FROM products WHERE stock_quantity<5", function (err, res) {
            if (err) reject(Error(err));

            if (res.length < 1) return reject('No items with stock < 5.');

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
            res.forEach( element => {
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
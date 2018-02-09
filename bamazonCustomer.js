const mysql = require('mysql');
const inquirer = require('inquirer');
const {table} = require('table');
const chalk = require('chalk');

const sqlConnection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
});

const start = function() {
    // inquirer.prompt()

    printItemList()
    .then( () => {
        return inquirer.prompt(
            [
                {
                    type: 'input',
                    name: 'itemID',
                    message: 'Please enter the ID of the item you would like to purchase.'
                },
                {
                    type: 'input',
                    name: 'itemQuantity',
                    message: 'Please enter quantity you would like to purchase.'
                }
            ]
        )
    })
    .then(answers => {
        var itemID = answers.itemID;
        var itemQuantity = answers.itemQuantity;

        return placeOrder(itemID, itemQuantity)
            // sqlConnection.end();
    })
    .then( result => {
        start();
    });
    

}

const printItemList = function() {
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

const placeOrder = function(itemId, itemQuantity) {
    return new Promise( (resolve, reject) => {
        sqlConnection.query("SELECT price, stock_quantity FROM products WHERE item_id=?", [itemId], function (err, res) {
            if (err) reject(Error(err));
            // Log all results of the SELECT statement
            console.log();
            if (res.length === 1) {
                var total_price = res[0].price * itemQuantity;
                if (itemQuantity <= res[0].stock_quantity) {
                    var newQuantity = res[0].stock_quantity - itemQuantity;
                    console.log('Placing Order...');
                    sqlConnection.query('UPDATE products SET stock_quantity=? WHERE item_id=?', [newQuantity, itemId], function (err, res) {
                        if (err) reject(Error(err));
                        console.log('Order Placed!');
                        console.log("Cost of order = $ " + chalk.green.bold(total_price.toFixed(2).toString()));
                        console.log();
                        resolve();
                    });
                }
                else {
                    console.log('Not enough in stock to place order');
                }
            }
            else {
                console.log('ItemID not found');
            }
            console.log();
            resolve();
        });
    });
}

start();
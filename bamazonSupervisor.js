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
                return viewProductSalesByDepartment();
                break;

            case 'Create New Department':
                return addNewDepartment();
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

const addNewDepartment = function() {
    return new Promise( (resolve, reject) => {
        inquirer.prompt(
            [
                {
                    type: 'input',
                    name: 'departmentName',
                    message: 'New Department name.'
                },
                {
                    type: 'input',
                    name: 'departmentOverhead',
                    message: 'New department overhead'
                }
            ]
        )
        .then( answers => { 
            sqlConnection.query("INSERT INTO departments (department_name, over_head_costs) VALUES (?, ?)", [answers.departmentName, answers.departmentOverhead], function (err, res) {
                if (err) reject(Error(err));

                if (res.affectedRows < 1) return reject('Item not added.');

                console.log(res.affectedRows + ' department added');
                resolve();
            });
        });
    });
}

const viewProductSalesByDepartment = function () {
    return new Promise( (resolve, reject) => {
        sqlConnection.query(`SELECT 
                                departments.department_id,
                                departments.department_name,
                                departments.over_head_costs,
                                SUM(products.product_sales) AS 'product_sales',
                                (SUM(products.product_sales) - departments.over_head_costs) AS 'total_profit'
                            FROM
                                departments
                                    LEFT JOIN
                                products ON products.department_name = departments.department_name
                            GROUP BY departments.department_name , departments.department_id , departments.over_head_costs
                            ORDER BY departments.department_id ASC`, function (err, res) {
            if (err) reject(Error(err));
            // Log all results of the SELECT statement
            var data = [];
            data.push(
                [
                    chalk.underline.bold('Department ID'),
                    chalk.underline.bold('Department Name'),
                    chalk.underline.bold('Overhead Costs'),
                    chalk.underline.bold('Product Sales'),
                    chalk.underline.bold('Total Profit')
                ]
            );
            res.forEach(element => {
                data.push(
                    [
                        element.department_id,
                        element.department_name,
                        element.over_head_costs,
                        element.product_sales,
                        element.total_profit
                    ]
                );
            });
            console.log(table(data));
            resolve();
        });
    });
}

start();
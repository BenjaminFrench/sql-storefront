# sql-storefront
This is node CLI program that interfaces with a MySQL database.

The database contains products which have prices and stock quantitys. They also belong to different departments.

* The bamazonCustomer.js program allows a user to purchase items. You select an item and a quantity and it updates the database to reflect the purchase. The program tells you how much the order costs.

* The bamazonManager.js program allows a manager to add new items, update inventory, view low stock, and view all products for sale.

* The bamazonSupervisor.js program allows a supervisor to view sales by department and add new departments. The sales by department is calculated using a SQL query containing SUM, JOIN, and GROUP BY.

See below for demos!
## Customer demo
![](https://i.imgur.com/a09poU9.gif)
## Manager demo
![](https://i.imgur.com/4pzU5h8.gif)
## Supervisor demo
![](https://i.imgur.com/auvSM3c.gif)

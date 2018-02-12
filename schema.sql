DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;
USE bamazon;

CREATE TABLE products (
    item_id INT(10) NOT NULL AUTO_INCREMENT,
	product_name VARCHAR(80) NOT NULL,
	department_name VARCHAR(80) NOT NULL,
	price DECIMAL(10,2) NOT NULL,
	stock_quantity INT(10) NOT NULL,
	product_sales DECIMAL(10,2),
	PRIMARY KEY (item_id)
);

CREATE TABLE bamazon.departments (
 department_id INT NOT NULL AUTO_INCREMENT,
 department_name VARCHAR(45) NULL,
 over_head_costs DECIMAL(10,2) NOT NULL,
 PRIMARY KEY (department_id));

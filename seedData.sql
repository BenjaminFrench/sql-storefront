USE bamazon;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Kindle", "Electronics", 99.99, 100),
("Xbox", "Electronics", 224.00, 91),
("Settlers of Catan ", "Toys and Games", 21.95, 25),
("Monopoly", "Toys and Games", 14.79, 40),
("Orange Juice", "Groceries", 3.50, 25),
("Doritos", "Groceries", 3.85, 14),
("Football", "Sports and Outdoors", 29.99, 30),
("Skateboard", "Sports and Outdoors", 49.90, 20),
("Paint", "Home Improvement", 22.60, 20),
("Hammer", "Home Improvement", 10.57, 20),
("Shampoo", "Beauty and Health", 9.99, 20),
("Tide Pods", "Beauty and Health", 18.97, 20),
("Stranger In A Strange Land", "Books", 8.99, 20),
("One Flew Over the Cuckoo's Nest", "Books", 9.99, 20);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("Electronics", 23000),
("Toys and Games", 2000),
("Groceries", 4000),
("Sports and Outdoors", 5000),
("Home Improvement", 1000),
("Beauty and Health", 2000),
("Books", 1000);
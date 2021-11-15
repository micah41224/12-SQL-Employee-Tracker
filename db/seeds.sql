INSERT INTO department_table (department_name)
VALUES 
        ("Research"),
        ("Finance"),
        ("IT"),
        ("HR");

INSERT INTO role_table (title, salary, department_id)
VALUES
        ("Manager", 100000, 4),
        ("Lead Engineer", 80000, 3),
        ("Software Engineer", 60000, 3),
        ("Accountant", 50000, 2),
        ("Lead Researcher", 90000, 1),
        ("Intern", 1, 4);

INSERT INTO employee_table (first_name, last_name, role_id, manager_id)
VALUES
        ("Dominic", "Toretto", 5, null),
        ("Brian", "Oconner", 6, 1),
        ("Letty", "Ortiz", 1, null),
        ("Mia", "Brewster", 4, 3),
        ("Roman", "Pearce", 6, 3),
        ("Luke", "Hobbs", 2, null),
        ("Deckard", "Shaw", 3, 6);

const con = require("./db");
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: 'asset-borrowing-secret',
        resave: false,
        saveUninitialized: false,
    }),
);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

app.get("/password/:password", function (req, res) {
    const password = req.params.password;
    bcrypt.hash(password, 10, function (err, hash) {
        if (err) {
            console.error(err);
            return res.status(500).send("Password hashing error");
        }
        res.status(200).send(hash);
    });
})

// ==========================
// Login
// ==========================
app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    const sql = `SELECT id, username, password, role FROM users WHERE username = ?`;
    con.query(sql, [username], function (err, result) {
        if (err) {
            console.error(err);
            return res.status(500).send("Internal Server Error");
        }

        if (result.length === 0) {
            return res.status(401).send("Username doesn't exist");
        }

        bcrypt.compare(password, result[0].password, function (err, isMatch) {
            if (err) {
                return res.status(500).send("Authentication Server Error");
            }

            if (isMatch) {
                const user = result[0];

                const roleMap = {
                    1: "staff",
                    2: "lecturer",
                    3: "student"
                };

                const userRoleStr = roleMap[user.role];
                if (!userRoleStr) {
                    return res.status(403).send("Forbidden: Unknown Role");
                }

                req.session.userId = user.id;
                req.session.role = userRoleStr;

                return res.status(200).json({ role: userRoleStr });
            } else {
                return res.status(401).send("Wrong password");
            }
        });
    });
});

// ==========================
// REGISTER
// ==========================
app.post("/register", function (req, res) {
    const { first_name, last_name, username, email, password, confirmPassword } = req.body;

    //Check if passwords match before proceeding
    if (password !== confirmPassword) {
        return res.status(400).send("Passwords do not match");
    }

    //Check if username or email already exists before inserting
    const checkSql = `SELECT id FROM users WHERE username = ? OR email = ?`;
    con.query(checkSql, [username, email], function (err, result) {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).send("Database error");
        }

        //If username or email already exists, return 409 Conflict
        if (result.length > 0) {
            return res.status(409).send("Username or email already exists");
        }

        //Hash the password before inserting into the database
        bcrypt.hash(password, 10, function (err, hashedPassword) {
            if (err) {
                console.error(err);
                return res.status(500).send("Password hashing error");
            }

            //Insert user into the database with hashed password
            const sql = `INSERT INTO users (first_name, last_name, username, password, role, email) VALUES (?, ?,?, ?, 3, ?)`;
            con.query(sql, [first_name, last_name, username, hashedPassword, email], function (err, result) {
                if (err) {
                    console.error("Database Error:", err);
                    return res.status(500).send("Database error");
                }

                //If everything succeeds, send success response
                return res.status(200).send("Student registered successfully");
            });
        });
    });
});

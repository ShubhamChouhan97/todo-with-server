const http = require("http");
const fs = require("fs");
const path = require('path');
let dataArray = [];
const server = http.createServer((req, res) => {
    console.log(req.url);

    if (req.url == "/") {
        fs.readFile("login.html", "utf-8", (err, data) => {
            if (err) {
                console.log(err);
            }
            res.setHeader("Content-Type", "text/html");
            res.write(data);
            res.end();
        });
    } else if (req.url === "/login.css") {
        fs.readFile("login.css", "utf-8", (err, data) => {
            if (err) {
                console.log(err);
            }
            res.setHeader("Content-Type", "text/css");
            res.write(data);
            res.end();
        });
    } else if (req.url === "/login.js") {
        fs.readFile("login.js", "utf-8", (err, data) => {
            if (err) {
                console.log(err);
            }
            res.write(data);
            res.end();
        });
    } else if (req.url === "/logindata" && req.method === "POST") {
        let body = "";
        req.on("data", chunk => {
            body += chunk;
        });
        req.on("end", () => {
            try {
                const newEntry = JSON.parse(body);

                // Read existing data
                fs.readFile("data.txt", "utf-8", (err, data) => {
                    if (err && err.code !== 'ENOENT') {
                        console.error(err);
                        res.statusCode = 500;
                        res.end("Internal Server Error");
                        return;
                    }

                    // Parse the file data as JSON
                    let users = [];
                    if (data) {
                        try {
                            users = JSON.parse(data);
                        } catch (e) {
                            console.error("Error parsing existing data:", e);
                            res.statusCode = 500;
                            res.end("Internal Server Error");
                            return;
                        }
                    }

                    let userFound = false;
                    users.forEach(element => {
                        if (element.username === newEntry.username && element.password === newEntry.password) {
                            userFound = true;
                        }
                    });

                    if (userFound) {
                        res.end("User already registered");
                        console.log("User already registered");
                        return;
                    }

                    dataArray = users; // Populate the array with the current users
                    dataArray.push(newEntry);

                    // Write updated data
                    fs.writeFile("data.txt", JSON.stringify(dataArray, null, 2), (err) => {
                        if (err) {
                            console.error(err);
                            res.statusCode = 500;
                            res.end("Internal Server Error");
                            return;
                        }
                        res.statusCode = 200;
                        res.end("Data received and stored");
                    });
                });
            } catch (e) {
                console.error("JSON parse error:", e);
                res.statusCode = 400;
                res.end("Invalid JSON");
            }
        });
    } else if (req.url === "/logindatacheck" && req.method === "POST") {
        let body = "";
        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {
            body = JSON.parse(body);

            fs.readFile("data.txt", "utf-8", (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    // Assuming data.txt contains an array of user objects
                    const users = JSON.parse(data);

                    let userFound = false;
                    users.forEach(element => {
                        if (element.username === body.username && element.password === body.password) {
                            console.log("User found");
                            res.end(JSON.stringify({ redirect: "todo" }));
                            userFound = true;
                        }
                    });

                    if (!userFound) {
                        res.statusCode = 404;
                        res.end("User not found or invalid credentials");
                        console.log("User not found or invalid credentials");
                    }
                }
            });
        });
    } else if (req.url == "/todo") {
        fs.readFile("./todo1.html", "utf-8", (err, data) => {
            if (err) {
                console.log(err);
            }
            res.setHeader("Content-Type", "text/html");
            res.write(data);
            res.end();
        });
    } else if (req.url == "/todocss.css") {
        fs.readFile("./todocss.css", "utf-8", (err, data) => {
            if (err) {
                console.log(err);
            }
            res.setHeader("Content-Type", "text/css");
            res.write(data);
            res.end();
        });
    } else if (req.url == "/todojs.js") {
        fs.readFile("./todojs.js", "utf-8", (err, data) => {
            if (err) {
                console.log(err);
            }
            res.setHeader("Content-Type", "text/javascript");
            res.write(data);
            res.end();
        });
    } else if (req.url === '/img1.png') {
        const filePath = path.join(__dirname, 'img1.png');

        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Image not found');
                return;
            }

            res.writeHead(200, { 'Content-Type': 'image/png' });
            res.end(data);
        });
    } else if (req.url === '/unchecked.png') {
        const filePath = path.join(__dirname, 'unchecked.png');

        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Image not found');
                return;
            }

            res.writeHead(200, { 'Content-Type': 'image/png' });
            res.end(data);
        });
    } else if (req.url === '/checked.png') {
        const filePath = path.join(__dirname, 'checked.png');

        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Image not found');
                return;
            }

            res.writeHead(200, { 'Content-Type': 'image/png' });
            res.end(data);
        });
    } else if (req.url == "/favicon.ico") {
        res.end();
    } else if (req.url === "/saveTodo" && req.method === "POST") {
        let body = "";
        req.on("data", chunk => {
            body += chunk;
        });
        req.on("end", () => {
            const { username, tasks } = JSON.parse(body);

            fs.readFile("todoData.txt", "utf-8", (err, data) => {
                let todoData = {};
                if (!err && data) {
                    todoData = JSON.parse(data);
                }

                todoData[username] = tasks;

                fs.writeFile("todoData.txt", JSON.stringify(todoData, null, 2), (err) => {
                    if (err) {
                        console.error(err);
                        res.statusCode = 500;
                        res.end("Internal Server Error");
                        return;
                    }
                    res.statusCode = 200;
                    res.end("Tasks saved");
                });
            });
        });
    } else if (req.url.startsWith("/getTodo") && req.method === "GET") {
        const username = new URL(req.url, `http://${req.headers.host}`).searchParams.get("username");

        fs.readFile("todoData.txt", "utf-8", (err, data) => {
            if (err || !data) {
                res.statusCode = 404;
                res.end("No tasks found");
                return;
            }

            const todoData = JSON.parse(data);
            const userTasks = todoData[username] || [];
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(userTasks));
        });
    }
});

server.listen(3001, () => {
    console.log("Server is running");
});

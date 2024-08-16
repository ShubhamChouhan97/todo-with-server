// login js 
let signupdiv = document.getElementById('signup');
let weldiv = document.getElementById('wel');
let signindiv = document.getElementById('signin');
let loggedInUser = "";

function signup() {
    signupdiv.style.display = "block";
    signindiv.style.display = "none";
    weldiv.style.display = "none";
}

function signin() {
    signupdiv.style.display = "none";
    signindiv.style.display = "block";
    weldiv.style.display = "none";
}

function register() {
    var user = document.getElementById('username').value;
    var pass = document.getElementById('password').value;

    if (user.trim() === "" || pass.trim() === "") {
        alert("Please fill all the fields");
    } else {
        var data = {
            username: user,
            password: pass,
        };
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:3001/logindata");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(data));

        xhr.onload = () => {
            if (xhr.status === 200) {
                var response = xhr.responseText;

                if (response === "User already registered") {
                    alert("User already exists. Please try a different username.");
                } else {
                    alert("Registration successful");
                }
            } else {
                alert("Registration Failed");
            }
        };

        xhr.onerror = () => {
            console.error("Request error");
        };
    }

    document.getElementById('username').value = "";
    document.getElementById('password').value = "";
}


function login() {
    var user1 = document.getElementById('username2').value;
    var pass1 = document.getElementById('password2').value;

    if (user1.trim() === "" || pass1.trim() === "") {
        alert("Please fill all the fields");
    } else {
        var data = {
            username: user1,
            password: pass1,
        };
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:3001/logindatacheck");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(data));
        xhr.onload = () => {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                if (response.redirect) {
                    alert("Login Successful");
                    localStorage.setItem('loggedInUser', user1);
                    window.location.href = `http://localhost:3001/${response.redirect}`;
                } else {
                    alert("Login Failed");
                }
            } else if (xhr.status === 404) {
                alert("User not found or invalid credentials");
            } else {
                alert("Login Failed");
            }
        };
        xhr.onerror = () => {
            console.error("Request error");
        };
    }
    document.getElementById('username2').value = "";
    document.getElementById('password2').value = "";
}

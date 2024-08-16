// todo.js

let loggedInUser = ""; // Get this value from the login response or set it globally after login

 loggedInUser = localStorage.getItem('loggedInUser');
if (loggedInUser) {
    console.log(`Welcome, ${loggedInUser}`);
} else {
    console.error('No logged user found');
}
let namee = document.getElementById('namep');
let k = namee.innerHTML;
namee.innerHTML = k +  "  " + loggedInUser;

const inputBox = document.getElementById("input");
const listt = document.getElementById("listt");
let edit;

function addtask() {
    if (inputBox.value.trim() === "") {
        alert("Enter any task!");
    } else {
        let li = document.createElement("li");
        let txt = document.createTextNode(inputBox.value);
        li.appendChild(txt);
        listt.appendChild(li);

        let span = document.createElement("span");
        span.innerHTML = "\u00d7"; // cross icon
        li.appendChild(span);

        edit = document.createElement("button");
        edit.innerHTML = "Edit";
        edit.className = "btn3";
        edit.addEventListener("click", function () {
            var userInput = prompt('Please enter a value:');
            li.removeChild(li.childNodes[0]);
            let txt = document.createTextNode(userInput);
            li.prepend(txt);
            saveData();
        });
        li.appendChild(edit);

        inputBox.value = "";
        saveData();
    }
}

listt.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        saveData();
    } else if (e.target.tagName === "SPAN") {
        e.target.parentElement.remove();
        saveData();
    }
}, false);

function saveData() {
    const tasks = Array.from(listt.children).map(li => ({
        task: li.childNodes[0].nodeValue,
        checked: li.classList.contains("checked")
    }));

    const data = {
        username: loggedInUser,
        tasks: tasks
    };

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3001/saveTodo");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(data));
}

function showTask() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `http://localhost:3001/getTodo?username=${loggedInUser}`);
    xhr.onload = () => {
        if (xhr.status === 200) {
            const tasks = JSON.parse(xhr.responseText);
            tasks.forEach(task => {
                let li = document.createElement("li");
                let txt = document.createTextNode(task.task);
                li.appendChild(txt);
                if (task.checked) {
                    li.classList.add("checked");
                }
                listt.appendChild(li);

                let span = document.createElement("span");
                span.innerHTML = "\u00d7";
                li.appendChild(span);

                edit = document.createElement("button");
                edit.innerHTML = "Edit";
                edit.className = "btn3";
                edit.addEventListener("click", function () {
                    var userInput = prompt('Please enter a value:');
                    li.removeChild(li.childNodes[0]);
                    let txt = document.createTextNode(userInput);
                    li.prepend(txt);
                    saveData();
                });
                li.appendChild(edit);
            });
        }
    };
    xhr.send();
}

function removedata() {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3001/saveTodo");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({ username: loggedInUser, tasks: [] }));
    listt.innerHTML = "";
}

function logout(){
    loggedInUser = "";
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:3001/");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
    xhr.onload = () => {
        if (xhr.status === 200) {
            alert("Log-Out Successful");
            // gpoing to home page
            window.location.href = `http://localhost:3001/`;
        } else {
            alert("Log-Out Failed");
        }
    };
    xhr.onerror = () => {
        console.error("Request error");
    };
}

// Make sure to call showTask() when the page loads
showTask();


const express = require("express");
const app = new express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");

app.use(express.json());

app.get("/teacher", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../teacher/index.html"));
})

app.get("/login", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../login/index.html"));
})

app.get("/teacher.js", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../teacher/teacher.js"));
});

app.get("/login.js", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../login/login.js"));
});

app.get("/congrats", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../congrats/index.html"));
});

io.on("connection", (socket) => {
    //console.log(state.currentPin);

    socket.on("set-student-tardy", (index, tardy) => {
        state.students[index].tardy = tardy;
    });

    socket.on("set-student-absent", (index, absent) => {
        state.students[index].absent = absent;
    });

    socket.on("get-students", () => {
        socket.emit("get-students", state.students);
    });

    socket.on("get-pin", () => {
        socket.emit("get-pin", state.currentPin);
    });

    socket.on("new-pin", () => {
        state.currentPin = generateRandomPin();
        io.emit("new-pin", state.currentPin);
    })

    socket.on("new-login", (pin, name) => {
        if (pin == state.currentPin) {
            socket.emit("result", true);

            state.students.push({
                pin: pin,
                time: generateTimeString(),
                name: name,
                tardy: false,
                absent: false
            })
            io.emit("get-students", state.students);
            console.log(state.students);
        } else {
            socket.emit("result", false);
        }
    });
});

http.listen(50505, () => {
    console.log("listening on port 50505");
});

var state = {
    students: [],
    currentPin: generateRandomPin()
}

function generateTimeString() {
    let date = new Date();
    let hour = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
    let minute = date.getMinutes() > 12 ? date.getMinutes() - 12 : date.getMinutes();
    let second = date.getSeconds();

    return `${hour}:${minute}:${second}`;
}

function generateRandomPin() {
    const chars = "123456789".split("");
    let pin = "";
    for (var i = 0; i < 5; i++) {
        pin += chars[Math.floor(Math.random() * chars.length)];
    }

    return parseInt(pin);
}

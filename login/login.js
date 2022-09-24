const socket = io();

document.querySelector("#submit").addEventListener("click", () => {
    socket.emit("new-login", document.querySelector("#pin").value, document.querySelector("#name").value);
});

socket.on("result", (result) => {
    if (result) {
        window.location.replace("/congrats");
    } else {
        alert("Incorrect pin, please retry");
    }
});
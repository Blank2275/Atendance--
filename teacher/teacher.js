const socket = io();

let pin = 0;


socket.emit("get-pin");
socket.emit("get-students");

socket.on("get-students", (students) => {
    if (students.length > 0) document.getElementById("studentsList").innerHTML = "";
    for (let student of students) {
        let text = `<li>
					<div>
						<span>${student.name}</span>
						<div class="footer">${student.time} | ${student.pin}</div>
					</div>
				</li>`;
        document.getElementById("studentsList").innerHTML += text;
    }
});
socket.on("get-pin", (pin_) => {
    pin = pin_;
    console.log(pin);
    document.getElementById("pinDisplay").innerHTML = pin;
});

socket.on("new-pin", (newPin) => {
    pin = newPin;
    document.getElementById("pinDisplay").innerHTML = pin;
});

document.getElementById("newPin").addEventListener("click", (e) => {
    e.preventDefault();
    socket.emit("new-pin");
})
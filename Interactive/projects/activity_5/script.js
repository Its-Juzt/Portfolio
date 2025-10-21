addItem.onclick = function () {
let textbox = document.getElementById("textbox")
let container = document.getElementById("container")
let li = document.createElement("li");
li.textContent = textbox.value;
container.appendChild(li);
}

highlightAll.onclick = function () {
ali = document.querySelectorAll("li");
for (content of ali) {
content.style = "color: blue;";
}
}

removeAll.onclick = function () {
ali = document.querySelectorAll("li");
for (content of ali) {
content.remove();
}
}

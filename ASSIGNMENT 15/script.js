console.log("╔═╗  ═╗   ╦ ╦ ╔═╗");
console.log("║═║   ║   ║═╝ ║═║");
console.log("║ ║   ╚══ ║ ║ ║ ║");

console.log("AZKA")

const board = document.getElementById("board");
const addListBtn = document.getElementById("addListBtn");

addListBtn.addEventListener("click", () => {
    const list = document.createElement("div");
    list.className = "list";
    list.innerHTML = `
        <div class="list-title" contenteditable="true">New List</div>
        <button class="btn btn-link text-dark p-0">+ Add a card</button>
      `;
    board.insertBefore(list, addListBtn);
    setupAddCard(list.querySelector("button"));
});

function setupAddCard(button) {
    button.addEventListener("click", () => {
        const newCard = document.createElement("div");
        newCard.className = "card-input";
        newCard.draggable = true;
        newCard.innerHTML = `<input type="text" placeholder="Enter card...">`;
        button.parentElement.insertBefore(newCard, button);
    });
}
document.querySelectorAll(".list button").forEach(setupAddCard);

function addEditDeleteButtons(parent, input) {
    if (parent.querySelector(".edit-btn")) return;

    const editBtn = document.createElement("button");
    editBtn.className = "btn btn-sm btn-primary edit-btn";
    editBtn.textContent = "Edit";

    const delBtn = document.createElement("button");
    delBtn.className = "btn btn-sm btn-danger del-btn";
    delBtn.textContent = "Delete";

    parent.appendChild(editBtn);
    parent.appendChild(delBtn);

    editBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        input.readOnly = false;
        input.focus();
        editBtn.remove();
        delBtn.remove();
    });

    delBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        parent.remove();
    });
}

document.addEventListener("click", (e) => {
    document.querySelectorAll(".card-input input").forEach((input) => {
        const parent = input.parentElement;
        const clickedInside = parent.contains(e.target);
        if (!clickedInside && !input.readOnly) {
            input.readOnly = true;
            addEditDeleteButtons(parent, input);
        }
    });
});

document.addEventListener("click", (e) => {
    if (e.target.tagName === "INPUT") {
        e.stopPropagation();
        e.target.readOnly = false;
    }
});

let dragged = null;

document.addEventListener("dragstart", (e) => {
    if (e.target.classList.contains("card-input")) {
        dragged = e.target;
        e.target.style.opacity = "0.5";
    }
});

document.addEventListener("dragend", (e) => {
    if (dragged) dragged.style.opacity = "1";
    dragged = null;
});

document.addEventListener("dragover", (e) => {
    if (e.target.classList.contains("list")) e.preventDefault();
});

document.addEventListener("drop", (e) => {
    if (e.target.classList.contains("list")) {
        e.preventDefault();
        e.target.insertBefore(dragged, e.target.querySelector("button"));
    }
});
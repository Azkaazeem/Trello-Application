console.log("╔═╗  ═╗   ╦ ╦ ╔═╗");
console.log("║═║   ║   ║═╝ ║═║");
console.log("║ ║   ╚══ ║ ║ ║ ║");
console.log("AZKA")

const board = document.getElementById("board");
const addListBtn = document.getElementById("addListBtn");

// Array of different pastel colors for new lists
const listColors = ["#f8f79e", "#b9f3e4", "#ebebeb", "#ffdfba", "#ffb3ba", "#bae1ff", "#e0bbe4", "#d5ffcc"];

// Create a new List
addListBtn.addEventListener("click", () => {
    const list = document.createElement("div");
    list.className = "list";
    
    // Randomly select a color from the listColors array
    const randomColor = listColors[Math.floor(Math.random() * listColors.length)];
    list.style.background = randomColor; 

    list.innerHTML = `
        <div class="list-header d-flex justify-content-between align-items-center mb-2">
            <div class="list-title mb-0" contenteditable="true">New List</div>
            <button class="btn btn-sm text-danger delete-list-btn"><i class="fas fa-trash"></i></button>
        </div>
        <button class="btn btn-link text-dark p-0 mt-2 add-card-btn">+ Add a card</button>
    `;
    board.insertBefore(list, addListBtn);
    setupAddCard(list.querySelector(".add-card-btn"));
    setupDeleteList(list.querySelector(".delete-list-btn"));
});

// Setup Add Card logic
function setupAddCard(button) {
    button.addEventListener("click", (e) => {
        e.stopPropagation(); // <-- BUG FIX: Ye line naye card ko foran delete hone se bachati hai
        const newCard = document.createElement("div");
        newCard.className = "card-input";
        newCard.draggable = true;
        newCard.innerHTML = `<input type="text" placeholder="Enter card...">`;
        button.parentElement.insertBefore(newCard, button);
        newCard.querySelector('input').focus(); // Auto-focus new card
    });
}
document.querySelectorAll(".add-card-btn").forEach(setupAddCard);

// Setup Delete List logic with Animation
function setupDeleteList(button) {
    button.addEventListener("click", (e) => {
        const listToRemove = e.target.closest(".list");
        listToRemove.classList.add("fade-out"); // Trigger CSS animation
        setTimeout(() => {
            listToRemove.remove(); // Remove after animation completes
        }, 300); 
    });
}
document.querySelectorAll(".delete-list-btn").forEach(setupDeleteList);

// Add Edit/Delete buttons to cards
function addEditDeleteButtons(parent, input) {
    if (parent.querySelector(".edit-btn")) return;

    const editBtn = document.createElement("button");
    editBtn.className = "btn btn-sm btn-primary edit-btn";
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';

    const delBtn = document.createElement("button");
    delBtn.className = "btn btn-sm btn-danger del-btn";
    delBtn.innerHTML = '<i class="fas fa-trash"></i>';

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
        parent.classList.add("fade-out"); // Trigger CSS animation
        setTimeout(() => {
            parent.remove(); // Remove after animation completes
        }, 300);
    });
}

// Global click listeners to handle card editing states
document.addEventListener("click", (e) => {
    document.querySelectorAll(".card-input input").forEach((input) => {
        const parent = input.parentElement;
        const clickedInside = parent.contains(e.target);
        if (!clickedInside && !input.readOnly && input.value.trim() !== "") {
            input.readOnly = true;
            addEditDeleteButtons(parent, input);
        } else if (!clickedInside && !input.readOnly && input.value.trim() === "") {
            // Automatically delete empty cards when clicking away
            parent.remove(); 
        }
    });
});

document.addEventListener("click", (e) => {
    if (e.target.tagName === "INPUT" && e.target.closest(".card-input")) {
        e.stopPropagation();
        e.target.readOnly = false;
    }
});

// Drag and Drop Logic
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
    if (e.target.classList.contains("list") || e.target.closest(".list")) {
        e.preventDefault();
        const dropTargetList = e.target.classList.contains("list") ? e.target : e.target.closest(".list");
        const addCardBtn = dropTargetList.querySelector(".add-card-btn");
        dropTargetList.insertBefore(dragged, addCardBtn);
    }
});
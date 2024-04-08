"use strict";
let searchBtn = document.querySelector(".searchBtn");
let resetBtn = document.querySelector(".resetBtn");
const table = document.querySelector(".allTables");
const inputElements = document.querySelectorAll(".searchInput");
const cell = table === null || table === void 0 ? void 0 : table.querySelectorAll("td");
searchBtn.addEventListener("click", searchBooks);
function searchBooks(event) {
    event.preventDefault();
    let noMatchRow = table.querySelector(".no-data");
    if (!noMatchRow) {
        noMatchRow = table.insertRow();
        const cell = noMatchRow.insertCell(0);
        cell.colSpan = 9;
        cell.textContent = "No match found for the entered criteria.";
        cell.classList.add("no-data");
    }
    let noMatchMessage = "No match found for the entered criteria: ";
    let noMatch = false;
    for (let i = 0; i < inputElements.length; i++) {
        if (inputElements[i].value !== "") {
            let inputMatch = false;
            Array.from(table.rows).forEach((row) => {
                var _a;
                let column = row === null || row === void 0 ? void 0 : row.cells[i];
                if (column !== undefined && column !== null) {
                    let cellText = ((_a = (column.innerText || column.textContent)) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || "";
                    let inputValue = inputElements[i].value.toLowerCase();
                    if (cellText.includes(inputValue)) {
                        row.style.display = "";
                        table.rows[0].style.display = "";
                        inputMatch = true;
                    }
                    else {
                        table.rows[0].style.display = "";
                        row.style.display = "none";
                    }
                }
            });
            if (!inputMatch) {
                noMatchMessage += `${inputElements[i].placeholder} `;
                noMatch = true;
            }
        }
    }
    noMatchRow.cells[0].textContent = noMatch ? noMatchMessage : "";
    noMatchRow.style.display = noMatch ? "" : "none";
}
resetBtn.addEventListener("click", resetBooks);
function resetBooks(event) {
    event.preventDefault();
    inputElements.forEach((input) => {
        input.value = "";
    });
    Array.from(table.rows).forEach((row) => {
        row.style.display = "";
    });
    let noMatchRow = table.querySelector(".no-data");
    if (noMatchRow && noMatchRow.parentNode) {
        noMatchRow.parentNode.removeChild(noMatchRow);
    }
}

import API_URL from "./config.js";
// const url = "https://student-fed1.metis.academy/api/Books";
// const API_URL = "http://localhost:3000"
let tableBody = document.querySelector("tbody");

async function fetchData(url) {
    try {
        const response = await fetch(`${url}/api/books`);
        const data = await response.json();
        return data;
    } catch (error) {
        alert(error);
        return [];
    }
}

async function createTable(books) {
    if (books.length === 0) {
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        td.colSpan = 7;
        td.innerText = "No data to display.";
        td.className = "no-data";
        tr.appendChild(td);
        tableBody.appendChild(tr);
    } else {
        clearTable();
        books.forEach((book) => {
            let tr = document.createElement("tr");
            tr.appendChild(createTd(book.name));
            tr.appendChild(createTd(book.author));
            tr.appendChild(createTd(book.isbn));
            tr.appendChild(createTd(book.availableCopies));
            tr.appendChild(createTd(book.totalAvailableCopies));
            tr.appendChild(createTd(book.numberOfPages));
            tr.append(createIcon(book.id));
            tr.append(createButton(book.id));
            tableBody.appendChild(tr);
        });
    }
}

function createTd(value) {
    let td = document.createElement("td");
    td.innerText = value;
    return td;
}

function createIcon(id) {
    let td = document.createElement("td");
    let icon = document.createElement("i");
    let a = document.createElement("a");
    a.setAttribute('href', `./detailBook.html?id=${id}`);
    icon.className = "fa-solid fa-circle-info title-info";
    a.appendChild(icon);
    td.appendChild(a);
    return td;
}

async function deleteData(id) {
    if (confirm("Are you sure you want to delete the title?")) {
        try {
            const response = await fetch(`${API_URL}/api/books/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(errorData.message)
                return
            }

            alert("Deleted successfully");
            window.location.reload();
        } catch (error) {
            alert("There has been an error:", error);
        }
    } else {
        console.log("User canceled the operation.")
    }
}

function createButton(id) {
    let td = document.createElement("td");
    let button = document.createElement("button");
    button.className = "delete-button";
    button.innerText = "Delete";
    td.appendChild(button);
    button.onclick = () => { deleteData(id) };
    return td;
}

function clearTable() {
    tableBody.innerHTML = '';
}

fetchData(API_URL).then((books) => { createTable(books) });


export { createTable, clearTable, fetchData };
const url = "https://student-fed1.metis.academy/api/Dvds";
let tableBody = document.querySelector("tbody");

async function fetchData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        alert(error);
        return [];
    }
}

async function createTable(dvds) {

    if (dvds.length === 0) {
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        td.colSpan = 7;
        td.innerText = "No data to display.";
        td.className = "no-data";
        tr.appendChild(td);
        tableBody.appendChild(tr);
    } else {
        clearTable();
        dvds.forEach((data) => {
            let tr = document.createElement("tr");
            tr.appendChild(createTd(data.name));
            tr.appendChild(createTd(data.author));
            tr.appendChild(createTd(data.publishYear));
            tr.appendChild(createTd(data.availableCopies));
            tr.appendChild(createTd(data.totalAvailableCopies));
            tr.append(createIcon(data.id));
            tr.append(createButton(data.id));
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
    a.setAttribute('href', `./detailDVD.html?id=${id}`);
    icon.className = "fa-solid fa-circle-info title-info";
    a.appendChild(icon);
    td.appendChild(a);
    return td;
}

async function deleteData(id) {
    if (confirm("Are you sure you want to delete the title?")) {
        try {
            const response = await fetch(`https://student-fed1.metis.academy/api/Dvds/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
            }

            alert("Deleted successfully");
            window.location.reload();
        } catch (error) {
            alert("There has been an error:", error);
        }
    } else {
        console.log("User canceled the operation.");
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

fetchData(url).then((books) => createTable(books));

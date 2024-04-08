const url = "https://student-fed1.metis.academy/api/Members";
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

async function createTable(data) {

    if (data.length === 0) {
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        td.colSpan = 7;
        td.innerText = "No data to display.";
        td.className = "no-data";
        tr.appendChild(td);
        tableBody.appendChild(tr);

    } else {
        clearTable();
        data.forEach((oneData) => {
            let tr = document.createElement("tr");
            tr.appendChild(createTd(oneData.firstName));
            tr.appendChild(createTd(oneData.lastName));
            tr.appendChild(createTd(oneData.personalId));
            tr.appendChild(createTd(oneData.dateOfBirth));
            tr.append(createIcon(oneData.id));
            tr.append(createButton(oneData.id));
            tableBody.appendChild(tr);
        })
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
    a.setAttribute('href', `./detailMember.html?id=${id}`);
    icon.className = "fa-solid fa-circle-info title-info";
    a.appendChild(icon);
    td.appendChild(a);
    return td;
}

async function deleteData(id) {
    try {
        const response = await fetch(`https://student-fed1.metis.academy/api/Members/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`, console.log(errorText));
        }

        alert("Deleted successfully");
        window.location.reload();

    } catch (error) {
        alert("There has been an error:", error);
        console.log("There has been an error:", error);
    }
}

function createButton(id) {
    let td = document.createElement("td");
    let button = document.createElement("button");
    button.className = "delete-button";
    button.innerText = "Delete";
    td.appendChild(button);
    button.onclick = () => {

        if (confirm("Do you really want to delete the user?")) {

            deleteData(id)
        } else {

            console.log(("User canceled the operation."))
        }
    };
    return td;
}


function clearTable() {
    tableBody.innerHTML = '';
}

fetchData(url).then((books) => createTable(books));


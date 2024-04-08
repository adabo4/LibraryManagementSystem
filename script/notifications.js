const url = "https://student-fed1.metis.academy/api/Messages";
let tableBody = document.querySelector("tbody");

async function fetchData(url) {
    try {
        const res = await fetch(url);

        if (res.ok) {
            const data = await res.json();
            return data;

        } else if (res.status === 404) {
            alert("No data to display.");
            return [];

        }

        else {
            const errorText = res.statusText;
            throw new Error("There has been an error " + res.status + " message: " + errorText);

        }

    } catch (error) {
        alert("Error fetching data: " + error.message);
        console.error("There has been an error: " + error);
        return [];

    }
}

async function createTable(data) {

    try {

        if (data.length === 0) {
            let tr = document.createElement("tr");
            let td = document.createElement("td");
            td.colSpan = 7;
            td.innerText = "No data to display.";
            td.className = "no-data";
            tr.appendChild(td);
            tableBody.appendChild(tr);

        } else {
            clearTable()
            data.forEach((oneData) => {
                let tr = document.createElement("tr");
                tr.appendChild(createTd(oneData.member.firstName + " " + oneData.member.lastName));
                tr.appendChild(createTd(oneData.messageSubject));
                tr.appendChild(createTd(oneData.messageContext));
                tr.appendChild(createTd(oneData.sendData));
                tableBody.appendChild(tr);

            })
        }
    } catch (error) {
        console.error('Error creating table:', error);
    }
}

function createTd(value) {
    let td = document.createElement("td");
    td.innerText = value;
    return td;

}

function createIcon(className) {
    let td = document.createElement("td");
    let icon = document.createElement("i");
    icon.className = className;
    td.appendChild(icon);
    return td;
}



function createButton(id) {
    let td = document.createElement("td");
    let button = document.createElement("button");
    button.className = "delete-button";
    button.innerText = "Delete";
    td.appendChild(button);
    button.onclick = () => deleteData(id);
    return td;
}



function clearTable() {
    tableBody.innerHTML = '';
}


fetchData(url).then((books) => createTable(books));

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const url = "https://student-fed1.metis.academy/api/RentalEntries";
let tableBody = document.querySelector("tbody");
let infoIcon = "fa-solid fa-circle-info";
let rightArrow = "fa-solid fa-arrow-circle-right";
let leftArrow = "fa-solid fa-arrow-circle-left";
let filterBooksAndDvd = document.getElementById("types");
filterBooksAndDvd.addEventListener("change", filterData);
function fetchData(url) {
    return __awaiter(this, void 0, void 0, function* () {
        let data = [];
        yield fetch(url)
            .then((response) => response.json())
            .then((responseData) => (data = responseData))
            .catch((error) => alert(error));
        return data;
    });
}
function createTable(data) {
    clearTable();
    if (data.length === 0) {
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        td.colSpan = 9;
        td.innerText = "No data to display.";
        td.className = "no-data";
        tr.appendChild(td);
        tableBody === null || tableBody === void 0 ? void 0 : tableBody.appendChild(tr);
    }
    else if (!data.some(oneData => !oneData.isReturned)) {
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        td.colSpan = 9;
        td.innerText = "All rented items are returned.";
        td.className = "no-data";
        tr.appendChild(td);
        tableBody === null || tableBody === void 0 ? void 0 : tableBody.appendChild(tr);
    }
    else {
        clearTable();
        data.forEach((oneData) => {
            if (!oneData.isReturned) {
                let tr = document.createElement("tr");
                tr.appendChild(createTd(oneData.member.firstName + " " + oneData.member.lastName));
                tr.appendChild(createTd(oneData.title.name));
                tr.appendChild(createTd(oneData.title.author));
                tr.appendChild(createTd(oneData.rentedDate));
                tr.appendChild(createTd(oneData.returnDate));
                tr.appendChild(createTd(oneData.maxReturnDate));
                tr.appendChild(createTd(oneData.titleType === 1 ? "Book" : "DVD"));
                tr.appendChild(createIcon(leftArrow, oneData.id));
                tr.appendChild(createIcon(rightArrow, oneData.id));
                tableBody === null || tableBody === void 0 ? void 0 : tableBody.appendChild(tr);
            }
        });
    }
}
function createTd(value) {
    let td = document.createElement("td");
    td.style.padding = "4px";
    td.innerText = value;
    return td;
}
function styleTitleIcon(icon, hoverColor, color) {
    icon.style.cssText = `color: ${color}; fontSize: 1.2em;`;
    icon.addEventListener('mouseenter', () => {
        icon.style.color = `${hoverColor}`;
        icon.style.transform = 'scale(1.2)';
    });
    icon.addEventListener('mouseleave', () => {
        icon.style.color = `${color}`;
        icon.style.transform = 'scale(1.0)';
    });
}
function createIcon(className, id) {
    let td = document.createElement("td");
    let icon = document.createElement("i");
    icon.className = className;
    if (icon.className === rightArrow) {
        styleTitleIcon(icon, "lightblue", "blue");
        icon.onclick = () => {
            if (confirm("Do you really want to prolong the title?")) {
                try {
                    prolongData(id);
                }
                catch (error) {
                    console.log(error);
                }
            }
            else {
                console.log("User has cancelled the action.");
            }
        };
    }
    else {
        styleTitleIcon(icon, "lightgreen", "green");
        icon.onclick = () => {
            if (confirm("Do you really want to return the title?")) {
                returnOfTitle(id);
            }
            else {
                console.log("User has cancelled the action.");
            }
        };
    }
    td.appendChild(icon);
    return td;
}
function prolongData(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield fetchData(url);
        function getId() {
            for (let index = 0; index < data.length; index++) {
                const oneData = data[index];
                if (oneData.id === id) {
                    const res = {
                        memberId: oneData.memberId,
                        titleId: oneData.titleId,
                        timesProlongued: oneData.timesProlongued,
                        firstName: oneData.member.firstName,
                        lastName: oneData.member.lastName
                    };
                    return res;
                }
            }
        }
        const dataset = getId();
        try {
            const response = yield fetch(`${url}/ProlongTitle/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dataset)
            });
            if (!response.ok) {
                const errorText = yield response.text();
                throw new Error(`HTTP error! Status: ${response.status}, Error Message: ${errorText}`);
            }
            else if (response.status === 400) {
                alert(`Member ${dataset === null || dataset === void 0 ? void 0 : dataset.firstName} ${dataset === null || dataset === void 0 ? void 0 : dataset.lastName} has prolonged title with id ${dataset === null || dataset === void 0 ? void 0 : dataset.titleId} successfully ${dataset === null || dataset === void 0 ? void 0 : dataset.timesProlongued} times.`);
            }
            alert(`Member ${dataset === null || dataset === void 0 ? void 0 : dataset.firstName} ${dataset === null || dataset === void 0 ? void 0 : dataset.lastName} has prolonged title with id ${dataset === null || dataset === void 0 ? void 0 : dataset.titleId} successfully ${dataset === null || dataset === void 0 ? void 0 : dataset.timesProlongued} times.`);
        }
        catch (error) {
            console.log(error);
        }
        tableBody.innerHTML = "";
        createTable(data);
    });
}
function returnOfTitle(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield fetchData(url);
        function getId() {
            for (let i = 0; i < data.length; i++) {
                let oneTitle = data[i];
                if (oneTitle.id === id) {
                    const dataset = {
                        memberId: oneTitle.memberId,
                        titleId: oneTitle.titleId,
                        returnTitle: oneTitle.title.author + oneTitle.title.name
                    };
                    return dataset;
                }
            }
        }
        const dataset = getId();
        try {
            const res = yield fetch(`${url}/ReturnTitle/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dataset)
            });
            if (!res.ok) {
                const errorText = yield res.text();
                throw new Error(`HTTP error! Status: ${res.status}, Error Message: ${errorText}`);
            }
            else if (res.ok) {
                alert("The title has been returned successfully!");
                window.location.pathname = "./pages/allRentals.html";
            }
            else {
                alert(`Title with id ${id} is already returned`);
            }
        }
        catch (error) {
            console.log(error);
        }
        tableBody.innerHTML = "";
        createTable(data);
    });
}
function clearTable() {
    tableBody.innerHTML = '';
}
function filterData() {
    const selectedType = document.getElementById("types").value;
    fetchData(url).then((data) => {
        let filteredData;
        if (selectedType === "all") {
            filteredData = data;
        }
        else {
            filteredData = data.filter((item) => item.titleType === (selectedType === "book" ? 1 : 2));
        }
        createTable(filteredData);
    });
}
fetchData(url).then((books) => createTable(books));

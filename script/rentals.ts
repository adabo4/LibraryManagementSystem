const url: string = "https://student-fed1.metis.academy/api/RentalEntries";
let tableBody: HTMLTableSectionElement | null = document.querySelector("tbody");
let infoIcon: string = "fa-solid fa-circle-info";
let rightArrow: string = "fa-solid fa-arrow-circle-right";
let leftArrow: string = "fa-solid fa-arrow-circle-left";
let filterBooksAndDvd: HTMLElement | null = document.getElementById("types") as HTMLElement;

filterBooksAndDvd.addEventListener("change", filterData);

type MyObject = {
    id: number;
    isReturned: true;
    maxReturnDate: string;
    member: {
        firstName: string;
        lastName: string;
        personalId: string;
        dateOfBirth: string;
    },
    memberId: number;
    rentedDate: string;
    returnDate: string;
    timesProlongued: number;
    title: {
        author: string;
        name: string,
        availableCopies: number;
        totalAvailableCopies: number;
        id: number;
    }
    titleId: number;
    titleType: number;
}

async function fetchData(url: string): Promise<MyObject[]> {
    let data: MyObject[] = [];
    await fetch(url)
        .then((response) => response.json())
        .then((responseData) => (data = responseData))
        .catch((error) => alert(error))
    return data;
}


function createTable(data: MyObject[]): void {
    clearTable();

    if (data.length === 0) {
        let tr: HTMLTableRowElement = document.createElement("tr");
        let td: HTMLTableCellElement = document.createElement("td");
        td.colSpan = 9;
        td.innerText = "No data to display.";
        td.className = "no-data";
        tr.appendChild(td);
        tableBody?.appendChild(tr);
    }
    else if (!data.some(oneData => !oneData.isReturned)) {
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        td.colSpan = 9;
        td.innerText = "All rented items are returned.";
        td.className = "no-data";
        tr.appendChild(td);
        tableBody?.appendChild(tr);
    }
    else {
        clearTable();
        data.forEach((oneData: MyObject) => {
            if (!oneData.isReturned) {
                let tr: HTMLTableRowElement = document.createElement("tr");
                tr.appendChild(createTd(oneData.member.firstName + " " + oneData.member.lastName));
                tr.appendChild(createTd(oneData.title.name));
                tr.appendChild(createTd(oneData.title.author));
                tr.appendChild(createTd(oneData.rentedDate));
                tr.appendChild(createTd(oneData.returnDate));
                tr.appendChild(createTd(oneData.maxReturnDate));
                tr.appendChild(createTd(oneData.titleType === 1 ? "Book" : "DVD"));
                tr.appendChild(createIcon(leftArrow, oneData.id));
                tr.appendChild(createIcon(rightArrow, oneData.id));
                tableBody?.appendChild(tr);
            }
        })
    }
}

function createTd(value: string): HTMLTableCellElement {
    let td: HTMLTableCellElement = document.createElement("td");
    td.style.padding = "4px"
    td.innerText = value;
    return td;

}

function styleTitleIcon(icon: HTMLElement, hoverColor: string, color: string): void {
    icon.style.cssText = `color: ${color}; fontSize: 1.2em;`
    icon.addEventListener('mouseenter', () => {
        icon.style.color = `${hoverColor}`
        icon.style.transform = 'scale(1.2)';
    })
    icon.addEventListener('mouseleave', () => {
        icon.style.color = `${color}`
        icon.style.transform = 'scale(1.0)';
    })

}

function createIcon(className: string, id: number) {
    let td: HTMLTableCellElement = document.createElement("td");
    let icon: HTMLElement = document.createElement("i");
    icon.className = className;

    if (icon.className === rightArrow) {
        styleTitleIcon(icon, "lightblue", "blue")

        icon.onclick = () => {

            if (confirm("Do you really want to prolong the title?")) {
                try {
                    prolongData(id);

                } catch (error) {
                    console.log(error);

                }
            } else {
                console.log("User has cancelled the action.")
            }
        }

    } else {
        styleTitleIcon(icon, "lightgreen", "green")
        icon.onclick = () => {
            if (confirm("Do you really want to return the title?")) {
                returnOfTitle(id);
            }
            else {
                console.log("User has cancelled the action.")
            }
        }
    }

    td.appendChild(icon);
    return td;
}

async function prolongData(id: number): Promise<void> {

    const data: MyObject[] = await fetchData(url);

    function getId(): { memberId: number; titleId: number; timesProlongued: number; firstName: string; lastName: string; } | undefined {
        for (let index: number = 0; index < data.length; index++) {
            const oneData: MyObject = data[index];

            if (oneData.id === id) {
                const res = {
                    memberId: oneData.memberId,
                    titleId: oneData.titleId,
                    timesProlongued: oneData.timesProlongued,
                    firstName: oneData.member.firstName,
                    lastName: oneData.member.lastName

                }
                return res;
            }

        }
    }


    const dataset: {
        memberId: number;
        titleId: number;
        timesProlongued: number;
        firstName: string;
        lastName: string;
    } | undefined = getId();


    try {
        const response: Response = await fetch(`${url}/ProlongTitle/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataset)


        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}, Error Message: ${errorText}`);
        } else if (response.status === 400) {
            alert(`Member ${dataset?.firstName} ${dataset?.lastName} has prolonged title with id ${dataset?.titleId} successfully ${dataset?.timesProlongued} times.`)
        }

        alert(`Member ${dataset?.firstName} ${dataset?.lastName} has prolonged title with id ${dataset?.titleId} successfully ${dataset?.timesProlongued} times.`);


    } catch (error) {
        console.log(error);
    }

    tableBody!.innerHTML = "";

    createTable(data);

}

async function returnOfTitle(id: number): Promise<void> {

    const data: MyObject[] = await fetchData(url);

    function getId(): {
        memberId: number;
        titleId: number;
        returnTitle: string;
    } | undefined {

        for (let i = 0; i < data.length; i++) {
            let oneTitle = data[i];
            if (oneTitle.id === id) {
                const dataset: {
                    memberId: number;
                    titleId: number;
                    returnTitle: string;
                } = {
                    memberId: oneTitle.memberId,
                    titleId: oneTitle.titleId,
                    returnTitle: oneTitle.title.author + oneTitle.title.name

                }
                return dataset;

            }
        }
    }

    const dataset: {
        memberId: number;
        titleId: number;
        returnTitle: string;
    } | undefined = getId();

    try {
        const res: Response = await fetch(`${url}/ReturnTitle/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataset)
        });

        if (!res.ok) {
            const errorText: string = await res.text();
            throw new Error(`HTTP error! Status: ${res.status}, Error Message: ${errorText}`);

        }
        else if (res.ok) {
            alert("The title has been returned successfully!");
            window.location.pathname = "./pages/allRentals.html"
        } else {
            alert(`Title with id ${id} is already returned`);
        }

    } catch (error) {
        console.log(error);

    }

    tableBody!.innerHTML = "";

    createTable(data);

}

function clearTable(): void {

    tableBody!.innerHTML = '';
}

function filterData(): void {
    const selectedType = (document.getElementById("types") as HTMLSelectElement).value;

    fetchData(url).then((data: MyObject[]) => {
        let filteredData: MyObject[];

        if (selectedType === "all") {
            filteredData = data;
        } else {
            filteredData = data.filter((item) =>
                item.titleType === (selectedType === "book" ? 1 : 2)
            );
        }

        createTable(filteredData);
    });
}

fetchData(url).then((books: MyObject[]) => createTable(books));




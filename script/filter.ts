let searchBtn: HTMLButtonElement | null = document.querySelector(".searchBtn") as HTMLButtonElement;
let resetBtn: HTMLButtonElement | null = document.querySelector(".resetBtn") as HTMLButtonElement;

const table: HTMLTableElement = document.querySelector(".allTables") as HTMLTableElement;
const inputElements: NodeListOf<HTMLInputElement> = document.querySelectorAll(".searchInput");
const cell: NodeListOf<HTMLTableCellElement> | undefined = table?.querySelectorAll("td");

searchBtn.addEventListener("click", searchBooks);

function searchBooks(event: any): void {
    event.preventDefault();

    let noMatchRow: HTMLTableRowElement = table.querySelector(".no-data") as HTMLTableRowElement;

    if (!noMatchRow) {
        noMatchRow = table.insertRow();
        const cell: HTMLTableCellElement = noMatchRow.insertCell(0);
        cell.colSpan = 9;
        cell.textContent = "No match found for the entered criteria.";
        cell.classList.add("no-data");
    }
    let noMatchMessage: string = "No match found for the entered criteria: ";
    let noMatch: boolean = false;

    for (let i: number = 0; i < inputElements.length; i++) {
        if (inputElements[i].value !== "") {
            let inputMatch: boolean = false;

            Array.from(table.rows).forEach((row: any) => {
                let column = row?.cells[i];
                if (column !== undefined && column !== null) {
                    let cellText: string = (column.innerText || column.textContent)?.toLowerCase() || "";
                    let inputValue: string = inputElements[i].value.toLowerCase();

                    if (cellText.includes(inputValue)) {

                        row.style.display = ""
                        table.rows[0].style.display = ""
                        inputMatch = true;

                    } else {
                        table.rows[0].style.display = ""
                        row.style.display = "none"
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

resetBtn.addEventListener("click", resetBooks)

function resetBooks(event: any): void {
    event.preventDefault();

    inputElements.forEach((input) => {
        input.value = "";
    })

    Array.from(table.rows).forEach((row) => {
        row.style.display = ""
    })

    let noMatchRow = table.querySelector(".no-data") as HTMLTableRowElement | null;

    if (noMatchRow && noMatchRow.parentNode) {
        noMatchRow.parentNode.removeChild(noMatchRow);
    }


}



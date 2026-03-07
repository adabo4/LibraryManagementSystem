import API_URL from "./config.js";

let tableBody: HTMLTableSectionElement | null = document.querySelector("tbody");
let infoIcon: string = "fa-solid fa-circle-info";
let rightArrow: string = "fa-solid fa-arrow-circle-right";
let leftArrow: string = "fa-solid fa-arrow-circle-left";

let filterBooksAndDvd: HTMLElement | null = document.getElementById(
  "types",
) as HTMLElement;

filterBooksAndDvd.addEventListener("change", filterData);

type MyObject = {
  id: number;
  isReturned: boolean;
  maxReturnDate: string | null;
  member: {
    firstName: string;
    lastName: string;
    personalId: string;
    dateOfBirth: string;
  };
  memberId: number;
  rentedDate: string;
  returnDate: string | null;
  timesProlongued: number;
  title: {
    author: string;
    name: string;
    availableCopies: number;
    totalAvailableCopies: number;
    id: number;
  } | null;
  titleId: number;
  titleType: "BOOK" | "DVD";
};

async function fetchData(url: string): Promise<MyObject[]> {
  let data: MyObject[] = [];

  await fetch(url)
    .then((response) => response.json())
    .then((responseData) => (data = responseData))
    .catch((error) => alert(error));

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
    return;
  }

  if (!data.some((oneData) => !oneData.isReturned)) {
    let tr = document.createElement("tr");
    let td = document.createElement("td");
    td.colSpan = 9;
    td.innerText = "All rented items are returned.";
    td.className = "no-data";
    tr.appendChild(td);
    tableBody?.appendChild(tr);
    return;
  }

  data.forEach((oneData: MyObject) => {
    if (!oneData.isReturned) {
      let tr: HTMLTableRowElement = document.createElement("tr");

      tr.appendChild(
        createTd(oneData.member.firstName + " " + oneData.member.lastName),
      );
      tr.appendChild(createTd(oneData.title?.name ?? ""));
      tr.appendChild(createTd(oneData.title?.author ?? ""));
      tr.appendChild(createTd(oneData.rentedDate));
      tr.appendChild(createTd(oneData.returnDate ?? ""));
      tr.appendChild(createTd(oneData.maxReturnDate ?? ""));
      tr.appendChild(createTd(oneData.titleType === "BOOK" ? "Book" : "DVD"));
      tr.appendChild(createIcon(leftArrow, oneData.id));
      tr.appendChild(
        createIcon(rightArrow, oneData.id, oneData.timesProlongued),
      );

      tableBody?.appendChild(tr);
    }
  });
}

function createTd(value: string): HTMLTableCellElement {
  let td: HTMLTableCellElement = document.createElement("td");
  td.style.padding = "4px";
  td.innerText = value;
  return td;
}

function styleTitleIcon(
  icon: HTMLElement,
  hoverColor: string,
  color: string,
): void {
  icon.style.cssText = `color: ${color}; fontSize: 1.2em; cursor: pointer; transition: 0.2s;`;

  icon.addEventListener("mouseenter", () => {
    icon.style.color = hoverColor;
    icon.style.transform = "scale(1.2)";
  });

  icon.addEventListener("mouseleave", () => {
    icon.style.color = color;
    icon.style.transform = "scale(1.0)";
  });
}

function createIcon(
  className: string,
  id: number,
  maxProlonguedTimes?: number,
): HTMLTableCellElement {
  let td: HTMLTableCellElement = document.createElement("td");
  let icon: HTMLElement = document.createElement("i");
  icon.className = className;

  if (icon.className === rightArrow) {
    styleTitleIcon(icon, "lightblue", "blue");

    if ((maxProlonguedTimes ?? 0) >= 3) {
      styleTitleIcon(icon, "grey", "grey");
      icon.style.cursor = "not-allowed";
      icon.onclick = () => {
        alert("This title has already been prolonged 3 times.");
      };
    } else {
      icon.onclick = async () => {
        if (confirm("Do you really want to prolong the title?")) {
          try {
            await prolongData(id);
          } catch (error) {
            console.log(error);
          }
        } else {
          console.log("User has cancelled the action.");
        }
      };
    }
  } else {
    styleTitleIcon(icon, "lightgreen", "green");

    icon.onclick = async () => {
      if (confirm("Do you really want to return the title?")) {
        await returnOfTitle(id);
      } else {
        console.log("User has cancelled the action.");
      }
    };
  }

  td.appendChild(icon);
  return td;
}

async function prolongData(id: number): Promise<void> {
  const data: MyObject[] = await fetchData(`${API_URL}/api/rentalEntries`);

  function getId():
    | {
        memberId: number;
        titleId: number;
        timesProlongued: number;
        firstName: string;
        lastName: string;
      }
    | undefined {
    for (let index: number = 0; index < data.length; index++) {
      const oneData: MyObject = data[index];

      if (oneData.id === id) {
        return {
          memberId: oneData.memberId,
          titleId: oneData.titleId,
          timesProlongued: oneData.timesProlongued,
          firstName: oneData.member.firstName,
          lastName: oneData.member.lastName,
        };
      }
    }
  }

  const dataset = getId();

  try {
    const response: Response = await fetch(
      `${API_URL}/api/rentalEntries/prolongTitle/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataset),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      alert(errorData.message);
      return;
    }

    const updatedRental = await response.json();

    alert(
      `Member ${updatedRental.member.firstName} ${updatedRental.member.lastName} has prolonged the title successfully. Current prolong count: ${updatedRental.timesProlongued}.`,
    );

    const updatedData = await fetchData(`${API_URL}/api/rentalEntries`);
    createTable(updatedData);
  } catch (error) {
    console.log(error);
  }
}

async function returnOfTitle(id: number): Promise<void> {
  try {
    const res: Response = await fetch(
      `${API_URL}/api/rentalEntries/returnTitle/${id}`,
      {
        method: "PUT",
      },
    );

    if (!res.ok) {
      const errorText: string = await res.text();
      throw new Error(
        `HTTP error! Status: ${res.status}, Error Message: ${errorText}`,
      );
    }

    alert("The title has been returned successfully!");

    const updatedData = await fetchData(`${API_URL}/api/rentalEntries`);
    createTable(updatedData);
  } catch (error) {
    console.log(error);
  }
}

function clearTable(): void {
  if (tableBody) {
    tableBody.innerHTML = "";
  }
}

function filterData(): void {
  const selectedType = (document.getElementById("types") as HTMLSelectElement)
    .value;

  fetchData(`${API_URL}/api/rentalEntries`).then((data: MyObject[]) => {
    let filteredData: MyObject[];

    if (selectedType === "all") {
      filteredData = data;
    } else {
      filteredData = data.filter(
        (item) => item.titleType === (selectedType === "book" ? "BOOK" : "DVD"),
      );
    }

    createTable(filteredData);
  });
}

fetchData(`${API_URL}/api/rentalEntries`).then((rentals: MyObject[]) =>
  createTable(rentals),
);

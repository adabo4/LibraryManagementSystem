let memberList = document.getElementById("memberList");
let titleList = document.getElementById("titleList");

let inputMember = document.getElementById("member");
let inputTitle = document.getElementById("rentTitle");

const submitBtn = document.querySelector(".submitBtn");

let filledMemberList;
let titleId;
let memberId;


async function addMembersList() {
    const membersList = document.getElementById("memberList");


    try {
        const response = await fetch(
            "https://student-fed1.metis.academy/api/Members"
        );
        const data = await response.json();

        filledMemberList = data;

        data.sort((a, b) => a.firstName.trim().localeCompare(b.lastName.trim()));

        memberList.innerHTML = "";

        data.forEach((item, index) => {
            const option = document.createElement("option");
            option.value = `${index + 1}. ${item.firstName} ${item.lastName}`;
            option.setAttribute("data-member-id", item.id);

            membersList.appendChild(option);
        });

        return filledMemberList;
    } catch (error) {
        console.error("Error fetching data: ", error);
    }


}

addMembersList();


async function addTitleList() {
    const titleList = document.getElementById("titleList");

    try {
        const dvdResponse = await fetch("https://student-fed1.metis.academy/api/Dvds");
        const dvdData = await dvdResponse.json();


        const bookResponse = await fetch("https://student-fed1.metis.academy/api/Books");
        const bookData = await bookResponse.json();


        const combinedData = [...dvdData, ...bookData];

        titleList.innerHTML = "";

        combinedData.forEach((item, index) => {
            const option = document.createElement("option");
            if (item.isbn) {

                option.value = `${index + 1}. ${item.author} / ${item.name} / ISBN ${item.isbn}`;

            } else {

                option.value = `${index + 1}. ${item.author} / ${item.name}`;
            }

            option.setAttribute("data-title-id", item.id);
            titleList.appendChild(option);


        });



    } catch (error) {
        console.error("Error fetching data: ", error);
        return undefined
    }
}



addTitleList();

let date = new Date();
let todayDate = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
datePicker.placeholder = todayDate;

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}


let newBookDate = addDays(date, 21);
let newDVDdate = addDays(date, 7);

bookDate = `${newBookDate.getDate()}.${newBookDate.getMonth() + 1}.${newBookDate.getFullYear()}`;
dvdDate = `${newDVDdate.getDate()}.${newDVDdate.getMonth() + 1}.${newDVDdate.getFullYear()}`;

let rentalTime = document.querySelector(".rentalTime");

let maxTimeForBooks = document.createElement("p");
maxTimeForBooks.textContent = `Maximum return day for books is: ${bookDate} `;

rentalTime.appendChild(maxTimeForBooks);

let maxTimeForDvds = document.createElement("p");
maxTimeForDvds.textContent = `Maximum return day for DVD is: ${dvdDate}`;

rentalTime.appendChild(maxTimeForDvds);


if (submitBtn) {
    submitBtn.addEventListener("click", async (event) => {
        event.preventDefault();
        post(memberId, titleId);

    });

    inputTitle.addEventListener("input", getTitleId);
    inputMember.addEventListener("input", getMemberId);
}

function getMemberId() {
    const enteredValue = this.value;
    const memberList = document.getElementById("memberList");

    const selectedOption = Array.from(memberList.options).find(option =>
        option.value === enteredValue
    );

    if (selectedOption) {
        memberId = parseInt(selectedOption.getAttribute("data-member-id"));

    }
}

function getTitleId() {
    const enteredValue = this.value;
    const titleList = document.getElementById("titleList");
    const selectedOption = Array.from(titleList.options).find(option =>
        option.value === enteredValue
    );

    if (selectedOption) {
        titleId = parseInt(selectedOption.getAttribute("data-title-id"));

    }
}

async function post(titleid, memberid) {
    const data = {
        "memberId": titleid,
        "titleId": memberid
    }

    try {
        const response = await fetch("https://student-fed1.metis.academy/api/RentalEntries", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),

        })

        if (response.ok) {
            alert(`Title was successfully rented.`)

        }
        else {
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${response.statusText}`);

        }

        window.location.reload();

    } catch (error) {
        console.log(error)
    }

}




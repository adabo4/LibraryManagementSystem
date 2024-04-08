let titleOfDVD = document.getElementById("titleOfDVD");
let authorOfDVD = document.getElementById("authorOfDVD");
let availableDVDCopies = document.getElementById("availableDVDCopies");
let totalDVDCopies = document.getElementById("totalDVDCopies");
let publishYear = document.getElementById("publishYear");


const url = "https://student-fed1.metis.academy/api/Dvds";

let addItemsForm = document.querySelector(".add-items-form");

addItemsForm.addEventListener('submit', addItem);

function addItem() {
    event.preventDefault();

    const data = {
        name: titleOfDVD.value,
        author: authorOfDVD.value,
        availableCopies: availableDVDCopies.value,
        totalAvailableCopies: totalDVDCopies.value,
        publishYear: publishYear.value
    }

    postDVD(url, data);

    clearInputs([titleOfDVD, authorOfDVD, publishYear, availableDVDCopies, totalDVDCopies]);
}

async function postDVD(url, data) {

    try {

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        if (response.ok) {

        } else {
            const errorText = await response.json();
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`, console.log(errorText));
        }

        const responseData = await response.json();
        alert(`Title ${responseData.name} was inserted into the database.`);
    }

    catch (error) {
        alert(error);
        console.log(error);

    }
}

function clearInputs(inputs) {
    inputs.forEach(input => input.value = "");
}









let firstName = document.getElementById("firstName");
let lastName = document.getElementById("lastName");
let personalId = document.getElementById("personalId");
let dateOfBirth = document.getElementById("dateOfBirth");

let submitBtn = document.querySelector(".add-items-form");

const url = "https://student-fed1.metis.academy/api/Members";

submitBtn.addEventListener('submit', function (event) {
    addItem(event)
});

function addItem(event) {
    event.preventDefault();

    let fName = firstName.value.trim().toLowerCase();
    let lName = lastName.value.trim().toLowerCase();
    let pId = personalId.value.trim().toUpperCase();

    fName = fName.charAt(0).toUpperCase() + fName.slice(1);
    lName = lName.charAt(0).toUpperCase() + lName.slice(1);




    if (fName === "") {
        alert("Please enter your first name.");
    }
    else if (fName.length <= 2) {
        alert("First name must be at least 2 characters.");
    }
    else if (lName === "") {
        alert("Please enter your last name.");
    }
    else if (lName.length <= 2) {
        alert("Last name must be at least 2 characters.");
    }
    else if (pId === "" || pId.length !== 8) {
        alert("ID must be exactly 8 characters in the correct format: 'XX123456'");
    }
    else if (!pId.charAt(0).match(/^[A-Z]+$/) && !pId.charAt(1).match(/^[A-Z]+$/)) {
        alert("Please enter your ID in the correct format 'XX123456'");
    }
    else if (dateOfBirth.value === "") {
        alert("Please enter your date of birth.");
    }
    else {

        const data = {
            firstName: fName,
            lastName: lName,
            personalId: personalId.value,
            dateOfBirth: dateOfBirth.value,
        }
        post(url, data);
    }


    clearInputs([firstName, lastName, personalId, dateOfBirth]);

}

async function post(url, data) {

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
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);

        }

        const responseData = await response.json();
        alert(`Member ${responseData.firstName} ${responseData.lastName} was inserted into the database.`);
    }

    catch (error) {
        alert(error);
        console.log("There has been an error: " + error);
    }
}

function clearInputs(inputs) {
    inputs.forEach(input => input.value = "");
}

















let titleOfBook = document.getElementById("titleOfBook");
let authorOfBook = document.getElementById("authorOfBook");
let availableBookCopies = document.getElementById("availableBookCopies");
let totalBookCopies = document.getElementById("totalBookCopies");
let pageNumbers = document.getElementById("pageNumbers");
let isbn = document.getElementById("isbn");



const url = "https://student-fed1.metis.academy/api/Books";

let submitBtn = document.querySelector(".add-items-form");

submitBtn.addEventListener('submit', addBook);


function addBook() {
    event.preventDefault()

    const data = {
        name: titleOfBook.value,
        author: authorOfBook.value,
        availableCopies: availableBookCopies.value,
        totalAvailableCopies: totalBookCopies.value,
        numberOfPages: pageNumbers.value,
        isbn: isbn.value
    }

    post(url, data);
    clearInputs([titleOfBook, authorOfBook, availableBookCopies, totalBookCopies, pageNumbers, isbn]);

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
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`, console.log(errorText))
        }

        const responseData = await response.json()
        alert(`The title with these data has been entered into the database:
        Author: ${responseData.author}
        Title: ${responseData.name}
        Available Copies: ${responseData.availableCopies}
        Number of Pages: ${responseData.numberOfPages}
        ISBN: ${responseData.isbn}
        `)
    }

    catch (error) {
        alert(error);
        console.log(error);
    }
}

function clearInputs(inputs) {
    inputs.forEach(input => input.value = "");
}











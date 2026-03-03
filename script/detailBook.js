import API_URL from "./config.js"
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
// const url = "https://student-fed1.metis.academy/api/Books";
//const API_URL = "http://localhost:3000"


let author = document.getElementById("author");
let name = document.getElementById("title");
let isbn = document.getElementById("isbn");
let numberOfPages = document.getElementById("numberOfPages");
let totalAvailableCopies = document.getElementById("totalAvailableCopies");

const titleDetailForm = document.querySelector(".title-detail-form");

const deleteBtn = document.querySelector(".deleteBtn");

deleteBtn.addEventListener("click", async function (e) {
    e.preventDefault();

    const isConfirmed = confirm("Are you sure you want to delete data?");

    if (isConfirmed) {
        try {
            await deleteData();
            window.location.pathname = "./pages/books.html";

        } catch (error) {
            alert(error);
        }
    } else {
        console.log("User canceled the operation.")
    }
})

titleDetailForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const isConfirmed = confirm("Are you sure you want to change data?");

    if (isConfirmed) {
        try {
            await updateData();
            window.location.pathname = "./pages/books.html";
        } catch (error) {
            alert(error);
        }
    } else {
        console.log("User canceled the operation");
    }
});


const inputs = [
    'author',
    'totalAvailableCopies',
    'isbn',
    'numberOfPages'
];



async function fetchBook(url, id) {
    try {
        const res = await fetch(`${url}/api/books/${id}`);
        const data = await res.json();
        console.log(data)
        if (res.status !== 200) {
            throw new Error(res.statusText);
        }

        return data;
    } catch (error) {
        console.log(error);
    }
}

async function fetchData() {
    try {
        const book = await fetchBook(API_URL, id);

        title.value = book.name;
        inputsFunction(book);

    } catch (error) {
        return alert(error);
    }


}

fetchData();

function inputsFunction(book) {

    for (const oneBook in book) {
        inputs.forEach((input) => {
            if (input === oneBook) {
                const inputElement = document.getElementById(input);
                if (inputElement) {
                    inputElement.value = book[oneBook];
                }
            }
        })
    }
}


async function updateData() {

    const updateDataconst = {
        author: author.value,
        name: name.value,
        totalAvailableCopies: totalAvailableCopies.value,
        isbn: isbn.value,
        numberOfPages: numberOfPages.value
    }


    try {
        let res = await fetch(`${API_URL}/api/books/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updateDataconst)

        });

        console.log(updateDataconst)

        if (!res.ok) {
            const errorData = await res.json();
            console.log(errorData)
            throw new Error(`HTTP error! Status: ${res.status}, Errors: ${(errorData)}`);

        }

    } catch (error) {
        console.error(error)
    }

}

async function deleteData() {

    try {
        const res = await fetch(`${API_URL}/api/books/${id}`, {
            method: "DELETE"
        })

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(`HTTP error! Status: ${res.status}, Errors: ${JSON.stringify(errorData)}`)
        }
    } catch (error) {
        console.log(error);
    }
}













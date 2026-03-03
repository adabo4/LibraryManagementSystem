const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
import API_URL from "./config.js";
// const url = "https://student-fed1.metis.academy/api/Dvds";
// const url = "http://localhost:3000/api/Dvds";

let name = document.getElementById("title");
const titleDetailForm = document.querySelector(".title-detail-form");

const deleteBtn = document.querySelector(".deleteBtn");

deleteBtn.addEventListener("click", async function (e) {
    e.preventDefault();

    const isConfirmed = confirm("Are you sure you want to delete data?");

    if (isConfirmed) {
        try {
            await deleteData(url, id);
            window.location.href = "/pages/dvd.html";

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
            alert("Data successfully updated!");
            window.location.pathname = "./pages/dvd.html";
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
    'numberOfMinutes',
    'publishYear'
];

async function fetchBook(url, id) {
    try {
        const res = await fetch(`${url}/api/dvds/${id}`);
        const data = await res.json();

        if (res.status !== 200) {
            alert("No data given.");
        }
        return data;
    } catch (error) {
        console.log(error);
    }
}

async function fetchData() {
    try {
        const dvd = await fetchBook(API_URL, id);
        if (dvd) {
            name.value = dvd.name;
            inputsFunction(dvd);
        }

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
    try {
        const author = document.getElementById("author");
        const name = document.getElementById("title");
        const totalAvailableCopies = document.getElementById("totalAvailableCopies");
        const publishYear = document.getElementById("publishYear");
        const numberOfMinutes = document.getElementById("numberOfMinutes")

        const updateDataconst = {
            author: author.value,
            name: name.value,
            totalAvailableCopies: parseInt(totalAvailableCopies.value),
            publishYear: parseInt(publishYear.value),
            numberOfMinutes: parseInt(numberOfMinutes.value)
        };

        console.log('Sending update data:', updateDataconst);

        let res = await fetch(`${API_URL}/api/dvds/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updateDataconst),
        });

        if (!res.ok) {
            let errorMessage;
            try {
                const errorData = await res.json();
                errorMessage = `HTTP error! Status: ${res.status}, Errors: ${JSON.stringify(errorData)}`;
                console.log('Error response:', errorData);
            } catch {
                const text = await res.text();
                errorMessage = `HTTP error! Status: ${res.status}: ${text}`;
            }
            throw new Error(errorMessage);
        }

        console.log('Update successful');
        return await res.json();
    } catch (error) {
        console.log('Update error:', error);
        throw error;
    }
}


async function deleteData(url, id) {

    try {
        const res = await fetch(`${url}/api/dvds/${id}`, {
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





















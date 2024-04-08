const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
const url = "https://student-fed1.metis.academy/api/Dvds";

let name = document.getElementById("title");
const titleDetailForm = document.querySelector(".title-detail-form");

const deleteBtn = document.querySelector(".deleteBtn");

deleteBtn.addEventListener("click", async function (e) {
    e.preventDefault();

    const isConfirmed = confirm("Are you sure you want to delete data?");

    if (isConfirmed) {
        try {
            await deleteData();
            window.location.pathname = "./pages/dvd.html";

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
        const res = await fetch(`${url}/${id}`);
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
        const dvd = await fetchBook(url, id);
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

        const updateDataconst = {
            author: author.value,
            name: name.value,
            totalAvailableCopies: totalAvailableCopies.value,
            publishYear: publishYear.value,

        };

        let res = await fetch(`${url}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updateDataconst),
        });

        if (!res.ok) {
            const errorData = await res.json();
            console.log(errorData);
            throw new Error(`HTTP error! Status: ${res.status}, Errors: ${JSON.stringify(errorData)}`);
        }
    } catch (error) {
        console.log(error);
    }
}


async function deleteData() {

    try {
        const res = await fetch(`${url}/${id}`, {
            method: "DELETE"
        })

        if (!res.ok) {
            const errorData = res.json();
            throw new Error(`HTTP error! Status: ${res.status}, Errors: ${(errorData)}`)
        }

    } catch (error) {
        console.log(error);
    }
}





















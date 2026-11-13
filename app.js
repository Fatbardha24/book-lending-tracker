
let books = BookLibrary.load();

const form = document.getElementById("bookForm");
const table = document.getElementById("bookTable");

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();
    const borrower = document.getElementById("borrower").value.trim();
    const dueDate = document.getElementById("dueDate").value;
    const genre = document.getElementById("genre").value;

    if (!title || !author || !borrower || !dueDate || !genre) {
        alert("Please fill in all fields.");
        return;
    }

    const book = {
        id: Date.now() + Math.random(),
        title: title,
        author: author,
        borrower: borrower,
        dueDate: dueDate,
        genre: genre,
        returned: false
    };

    books.push(book);

    BookLibrary.save(books);
    displayBooks();
    form.reset();
});

function displayBooks() {
    table.innerHTML = "";

    let overdueCount = 0;

    if (books.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 7;
        cell.textContent = "No book loans available.";
        cell.className = "empty-message";

        row.appendChild(cell);
        table.appendChild(row);
    }

    books.forEach(function(book) {
        const status = BookLibrary.status(book);

        if (status === "Overdue") {
            overdueCount++;
        }

        const row = document.createElement("tr");

        const values = [
            book.title,
            book.author,
            book.borrower,
            book.dueDate,
            book.genre
        ];

        values.forEach(function(value) {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const statusCell = document.createElement("td");
        statusCell.textContent = status;
        statusCell.className = status.toLowerCase();

        row.appendChild(statusCell);

        const actionCell = document.createElement("td");

        if (!book.returned) {
            const returnButton = document.createElement("button");

            returnButton.textContent = "Return";
            returnButton.className = "return-btn";

            returnButton.addEventListener("click", function() {
                returnBook(book.id);
            });

            actionCell.appendChild(returnButton);
        }

        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", function() {
            deleteBook(book.id);
        });

        actionCell.appendChild(deleteButton);
        row.appendChild(actionCell);
        table.appendChild(row);
    });

    document.getElementById("totalLoans").textContent =
        books.length;

    document.getElementById("overdueLoans").textContent =
        overdueCount;
}

function returnBook(id) {
    const book = books.find(function(item) {
        return item.id === id;
    });

    if (book) {
        book.returned = true;
        BookLibrary.save(books);
        displayBooks();
    }
}

function deleteBook(id) {
    books = books.filter(function(book) {
        return book.id !== id;
    });

    BookLibrary.save(books);
    displayBooks();
}

displayBooks();

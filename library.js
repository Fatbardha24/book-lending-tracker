
const BookLibrary = {
    save: function(books) {
        localStorage.setItem("books", JSON.stringify(books));
    },

    load: function() {
        try {
            const books = JSON.parse(
                localStorage.getItem("books") || "[]"
            );

            return Array.isArray(books) ? books : [];
        } catch (error) {
            return [];
        }
    },

    today: function() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    },

    status: function(book) {
        if (book.returned) {
            return "Returned";
        }

        if (book.dueDate < this.today()) {
            return "Overdue";
        }

        return "Active";
    }
};

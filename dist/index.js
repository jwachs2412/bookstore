import promptSync from "prompt-sync";
const prompt = promptSync();
const bookCollection = [
    ["Learning TypeScript", 25, 29.95, 0.15],
    ["TypeScript Quickly", 33, 34.95],
    ["Programming TypeScript", 2, 19.95, 0.1],
    ["TypeScript Deep Dive", 0, 38.5],
    ["Getting Started with TypeScript", 99, 10.99, 0.1],
    ["TypeScript Cookbook", 3, 15.99, 0.15]
];
// Get total of single book with discount included; helper function
function getBookTotal(book) {
    const discount = book[3] ?? 0;
    const discountedPrice = book[2] * (1 - discount);
    const total = book[1] * discountedPrice;
    return { discountedPrice, total, discount };
}
// Get total value of book collection
const totalValue = (books) => {
    let total = 0;
    for (const currentBook of books) {
        total += getBookTotal(currentBook).total;
    }
    return total;
};
// Get each book's info
function bookInfo(books) {
    for (const currentBook of books) {
        const { discountedPrice, total, discount } = getBookTotal(currentBook);
        consoleLogItem(`"${currentBook[0]}" - ${currentBook[1]} copies at ${discountedPrice.toFixed(2)} each ${discount ? "(discount: " + discount * 100 + "%)" : ""} -> Total: $${total.toFixed(2)}`);
    }
}
// Get each book's info - .forEach()
// function bookInfo(books: Book[]) {
//   books.forEach((currentBook) => {
//     const { discountedPrice, total, discount } = getBookTotal(currentBook);
//     consoleLogItem(
//       `"${currentBook[0]}" - ${currentBook[1]} copies at ${discountedPrice.toFixed(2)} each ${
//         discount ? "(discount: " + discount * 100 + "%)" : ""
//       } -> Total: $${total.toFixed(2)}`
//     );
//   });
// }
// Get each book's info - .map()
// function bookInfo(books: Book[]) {
//   return books.map((currentBook) => {
//     const { discountedPrice, total, discount } = getBookTotal(currentBook);
//     return `"${currentBook[0]}" - ${currentBook[1]} copies at ${discountedPrice.toFixed(2)} each ${
//       discount ? "(discount: " + discount * 100 + "%)" : ""
//     } -> Total: $${total.toFixed(2)}`;
//   });
// }
// Average Price per Book
function avgBookPrice(books) {
    let total = 0;
    let numOfBooks = 0;
    let avgPrice = 0;
    for (const currentBook of books) {
        numOfBooks += currentBook[1];
        total += getBookTotal(currentBook).total;
    }
    // consoleLogItem(total.toFixed(2));
    // consoleLogItem(numOfBooks);
    avgPrice = total / numOfBooks;
    consoleLogItem(`The average price per book is: $${avgPrice.toFixed(2)}`);
    // Another simplier solution; eliminates avgPrice variable
    // consoleLogItem(`The average price per book is: $${(total / numOfBooks).toFixed(2)}`);
}
// Function for Restocking Books
function restockBook(books, bookToFind, quantityToAdd) {
    const book = books.find(([title]) => title === bookToFind);
    if (book) {
        book[1] += quantityToAdd; // directly mutates quantityInStock
    }
    else {
        consoleLogItem(`Book not found: "${bookToFind}".`);
    }
    return books;
}
// Function for a MarkDown Sale
function markDownSale(books, qualifyingPrice, discountAmt) {
    let markedDownBooks = [];
    for (let i = 0; i < books.length; i++) {
        const book = books[i];
        if (book && book[2] > qualifyingPrice) {
            book[3] = discountAmt;
            markedDownBooks.push(book);
        }
    }
    return markedDownBooks;
}
function consoleLogItem(arg, optionalArg) {
    if (optionalArg !== undefined) {
        console.log(arg, optionalArg);
    }
    else {
        console.log(arg);
    }
}
// Generic function being used below
function filterItems(arr, predicate) {
    return arr.filter(predicate);
}
// Generic function as an arrow function
// const filterItems = <T>(arr: T[], predicate: (item: T) => boolean): T[] => arr.filter(predicate);
// Function to Detect Low Stock
const getLowStockBooks = filterItems(bookCollection, item => item[1] < 10);
consoleLogItem("\nBooks with Low Stock:");
getLowStockBooks.forEach(([title, quantityInStock]) => {
    consoleLogItem(`"${title}" -- only ${quantityInStock} left in stock!`);
});
// Books over $20
const booksOverTwenty = filterItems(bookCollection, item => item[2] > 20);
consoleLogItem("\nBooks over $20:\n", booksOverTwenty);
// Books out of Stock
const booksOutOfStock = filterItems(bookCollection, item => item[1] == 0);
consoleLogItem("\nBooks out of stock:\n", booksOutOfStock);
// Return last book in list
function lastEl(el) {
    if (el.length === 0) {
        return undefined;
    }
    return el[el.length - 1];
}
// Sort by Price
function sortByPrice(books, ascending) {
    const newBooksArray = [...books];
    ascending === true ? newBooksArray.sort((priceA, priceB) => priceA[2] - priceB[2]) : newBooksArray.sort((priceA, priceB) => priceB[2] - priceA[2]);
    return newBooksArray;
}
consoleLogItem("\nSorted by Price (Ascending):\n", sortByPrice(bookCollection, true));
consoleLogItem("\nSorted by Price (Descending):\n", sortByPrice(bookCollection, false));
// Sort by Stock
function sortByStock(books, ascending) {
    const newBooksArray = [...books];
    ascending === true ? newBooksArray.sort((stockA, stockB) => stockA[1] - stockB[1]) : newBooksArray.sort((stockA, stockB) => stockB[1] - stockA[1]);
    return newBooksArray;
}
consoleLogItem("\nSorted by Stock (Ascending):\n", sortByStock(bookCollection, true));
consoleLogItem("\nSorted by Stock (Descending):\n", sortByStock(bookCollection, false));
consoleLogItem(lastEl(bookCollection));
avgBookPrice(bookCollection);
bookInfo(bookCollection);
// consoleLogItem((636.4375 + 1153.35 + 35.91 + 0 + 979.209 + 40.7745).toFixed(2));
consoleLogItem(`\nTotal inventory value: $${totalValue(bookCollection).toFixed(2)}`);
consoleLogItem(restockBook(bookCollection, "Programming TypeScript", 5));
consoleLogItem(restockBook(bookCollection, "Hello World", 8));
consoleLogItem(markDownSale(bookCollection, 30, 0.2));
consoleLogItem(markDownSale(bookCollection, 18, 0.25));
bookInfo(bookCollection);
function showDashboard(books) {
    let dashboardPrompt = true;
    while (dashboardPrompt) {
        const choice = prompt("\nPlease enter a choice: (1 = Show Bookstore Dashboard, 2 = Exit): ");
        consoleLogItem(`You chose: ${choice}`);
        if (Number(choice) === 1) {
            consoleLogItem("You are now being shown the dashboard...\n");
            consoleLogItem("========================================\n");
            consoleLogItem("         📊 BOOKSTORE DASHBOARD\n");
            consoleLogItem("========================================\n");
            //   books.forEach(([title, quantityInStock]) => {
            //     if(quantityInStock > 0){
            //         return books.map(t => {
            //         })
            //     }
            //   })
            consoleLogItem(`Current Number of Titles in Stock: ${books.length}\n`);
            consoleLogItem(`The Total Value of Current Inventory is: $${totalValue(bookCollection).toFixed(2)}\n`);
        }
        else if (Number(choice) === 2) {
            consoleLogItem("You are now exiting the dashboard...");
            dashboardPrompt = false;
        }
        else {
            consoleLogItem("Invalid choice. You must choose 1 or 2.\n");
        }
    }
}
showDashboard(bookCollection);
//# sourceMappingURL=index.js.map
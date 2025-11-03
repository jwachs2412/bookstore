//If you want to push this a bit further later:

// Add sorting: e.g. by price or stock.

// Add search by title: using .find() or .some().

// Convert tuples to objects for better readability when you scale up.

// Add tests using a test framework (Vitest or Jest).

type Book = [title: string, quantityInStock: number, pricePerBook: number, discount?: number];

const bookCollection: Book[] = [
    ["Learning TypeScript", 25, 29.95, .15],
    ["TypeScript Quickly", 33, 34.95],
    ["Programming TypeScript", 2, 19.95, .10],
    ["TypeScript Deep Dive", 0, 38.50],
    ["Getting Started with TypeScript", 99, 10.99, .10],
    ["TypeScript Cookbook", 3, 15.99, .15]
]

// Get total of single book with discount included; helper function
function getBookTotal(book: Book) {
    const discount = book[3] ?? 0;
    const discountedPrice = book[2] * (1 - discount);
    const total = book[1] * discountedPrice;
    return { discountedPrice, total, discount };
}

// Get total value of book collection
const totalValue = (books: Book[]) => {
    let total = 0;

    for (const currentBook of books) {
        total += getBookTotal(currentBook).total;
    }

    return total;
};

// Get each book's info
function bookInfo(books: Book[]) {

    for (const currentBook of books) {
        const { discountedPrice, total, discount } = getBookTotal(currentBook);
        console.log(`"${currentBook[0]}" - ${currentBook[1]} copies at ${discountedPrice.toFixed(2)} each ${discount ? "(discount: " + discount * 100 + "%)" : ""} -> Total: $${total.toFixed(2)}`);
    }
};

// Average Price per Book
function avgBookPrice(books: Book[]) {
    let total: number = 0;
    let numOfBooks: number = 0;
    let avgPrice: number = 0; 

    for (const currentBook of books) {
        numOfBooks += currentBook[1];
        total += getBookTotal(currentBook).total;
    }

    // console.log(total.toFixed(2));
    // console.log(numOfBooks);
    avgPrice = total / numOfBooks;
    console.log(`The average price per book is: $${avgPrice.toFixed(2)}`)
    // Another simplier solution; eliminates avgPrice variable
    // console.log(`The average price per book is: $${(total / numOfBooks).toFixed(2)}`);
}

// Generic function being used below
function filterItems<T>(arr: T[], predicate: (item: T) => boolean): T[] {
  return arr.filter(predicate);
};
// Generic function as an arrow function
// const filterItems = <T>(arr: T[], predicate: (item: T) => boolean): T[] => arr.filter(predicate);

// Books over $20
const booksOverTwenty = filterItems<Book>(bookCollection, item => item[2] > 20);
console.log(booksOverTwenty);

// Books out of Stock
const booksOutOfStock = filterItems<Book>(bookCollection, item => item[1] == 0);
console.log(booksOutOfStock);

// Return last book in list
function lastEl<T>(el: Array<T>): T | undefined {
    if (el.length === 0) {
        return undefined;
    }
    return el[el.length - 1];
}
console.log(lastEl(bookCollection));

bookInfo(bookCollection);

avgBookPrice(bookCollection);

// console.log((636.4375 + 1153.35 + 35.91 + 0 + 979.209 + 40.7745).toFixed(2));
console.log(`Total inventory value: $${totalValue(bookCollection).toFixed(2)}`);


import promptSync from "prompt-sync"

const prompt = promptSync()

//If you want to push this a bit further later:

// Add sorting: e.g. by price or stock.

// Add search by title: using .find() or .some().

// Convert tuples to objects for better readability when you scale up.

// Add tests using a test framework (Vitest or Jest).

interface Book {
  readonly title: string
  quantityInStock: number
  pricePerBook: number
  discount?: number
}

const bookCollection: Book[] = [
  { title: "Learning TypeScript", quantityInStock: 25, pricePerBook: 29.95, discount: 0.15 },
  { title: "TypeScript Quickly", quantityInStock: 33, pricePerBook: 34.95 },
  { title: "Programming TypeScript", quantityInStock: 2, pricePerBook: 19.95, discount: 0.1 },
  { title: "TypeScript Deep Dive", quantityInStock: 0, pricePerBook: 38.5 },
  { title: "Getting Started with TypeScript", quantityInStock: 99, pricePerBook: 10.99, discount: 0.1 },
  { title: "TypeScript Cookbook", quantityInStock: 3, pricePerBook: 15.99, discount: 0.15 }
]

// Get total of single book with discount included; helper function
function getBookTotal(book: Book) {
  const discount = book.discount ?? 0
  const discountedPrice = book.pricePerBook * (1 - discount)
  const total = book.quantityInStock * discountedPrice
  return { discountedPrice, total, discount }
}

// Get total value of book collection
const totalValue = (books: Book[]) => {
  let total = 0

  for (const currentBook of books) {
    total += getBookTotal(currentBook).total
  }

  return total
}

// Get each book's info
function bookInfo(books: Book[]) {
  for (const currentBook of books) {
    const { discountedPrice, total, discount } = getBookTotal(currentBook)
    consoleLogItem(`"${currentBook.title}" - ${currentBook.quantityInStock} copies at ${discountedPrice.toFixed(2)} each ${discount ? "(discount: " + discount * 100 + "%)" : ""} -> Total: $${total.toFixed(2)}`)
  }
}

consoleLogItem("\nBook Collection pre-Markdown Sale Prices:")
bookInfo(bookCollection)

// Get each book's info - .forEach()
// function bookInfo(books: Book[]) {
//   books.forEach((currentBook) => {
//     const { discountedPrice, total, discount } = getBookTotal(currentBook);
//     consoleLogItem(
//       `"${currentBook.title}" - ${currentBook.quantityInStock} copies at ${discountedPrice.toFixed(2)} each ${
//         discount ? "(discount: " + discount * 100 + "%)" : ""
//       } -> Total: $${total.toFixed(2)}`
//     );
//   });
// }

// Get each book's info - .map()
// function bookInfo(books: Book[]) {
//   return books.map((currentBook) => {
//     const { discountedPrice, total, discount } = getBookTotal(currentBook);
//     return `"${currentBook.title}" - ${currentBook.quantityInStock} copies at ${discountedPrice.toFixed(2)} each ${
//       discount ? "(discount: " + discount * 100 + "%)" : ""
//     } -> Total: $${total.toFixed(2)}`;
//   });
// }

// Book Summary
function summarizeBook(book?: Book): string {
  if (!book) return "\nBook does not exist...\n"

  const { discountedPrice, discount } = getBookTotal(book)

  return discount ? `\n"${book.title}" -- $${book.pricePerBook.toFixed(2)} ($${discountedPrice.toFixed(2)} after ${discount * 100}% discount), ${book.quantityInStock} in stock` : `\n"${book.title}" -- $${book.pricePerBook.toFixed(2)}, ${book.quantityInStock} in stock`
}

consoleLogItem(summarizeBook(bookCollection[0]))
consoleLogItem(summarizeBook(bookCollection[1]))
consoleLogItem(summarizeBook(bookCollection[8]))

// Average Price per Book
function avgBookPrice(books: Book[]) {
  let total: number = 0
  let numOfBooks: number = 0
  let avgPrice: number = 0

  for (const currentBook of books) {
    numOfBooks += currentBook.quantityInStock
    total += getBookTotal(currentBook).total
  }

  // consoleLogItem(total.toFixed(2));
  // consoleLogItem(numOfBooks);
  avgPrice = total / numOfBooks
  consoleLogItem(`\n🏷️  Average price per book is: $${avgPrice.toFixed(2)}\n`)
  // Another simplier solution; eliminates avgPrice variable
  // consoleLogItem(`The average price per book is: $${(total / numOfBooks).toFixed(2)}`);
}

// Can be found in showDashboard function below
// avgBookPrice(bookCollection)

// Function for Restocking Books
function restockBook(books: Book[], bookToFind: string, quantityToAdd: number): Book[] {
  //   const book = books.find(({ title }) => title === bookToFind)
  let bookFound = false

  const updatedBooks = books.map(book => {
    if (book.title === bookToFind) {
      bookFound = true
      return { ...book, quantityInStock: book.quantityInStock + quantityToAdd }
    }
    return book
  })

  if (!bookFound) {
    consoleLogItem(`Book not found: "${bookToFind}."`)
  }

  return updatedBooks

  //   if (book) {
  //     book.quantityInStock += quantityToAdd // directly mutates quantityInStock
  //   } else {
  //     consoleLogItem(`Book not found: "${bookToFind}."`)
  //   }

  //   return books
}

consoleLogItem("\nBooks to Restock:")
consoleLogItem(restockBook(bookCollection, "Programming TypeScript", 5))
consoleLogItem(restockBook(bookCollection, "Hello World", 8))

// Function for a MarkDown Sale
function markDownSale(books: Book[], qualifyingPrice: number, discountAmt: number): Book[] {
  let markedDownBooks: Book[] = []

  //   for (let i = 0; i < books.length; i++) {
  //     const book = books[i]
  //     if (book && book.pricePerBook > qualifyingPrice) {
  //       book.discount = discountAmt
  //       markedDownBooks.push(book)
  //     }
  //   }

  books.forEach(book => {
    if (book && book.pricePerBook > qualifyingPrice) {
      book.discount = discountAmt
      markedDownBooks.push(book)
    }
  })

  return markedDownBooks
}

consoleLogItem("\nBooks On Sale:")
consoleLogItem(markDownSale(bookCollection, 30, 0.2))
consoleLogItem(markDownSale(bookCollection, 18, 0.25))
// Calling the book collection after markdown sale posted above
consoleLogItem("\nBook Collection after Markdown Sale Implemented:")
bookInfo(bookCollection)

// Generic function for console.log()
function consoleLogItem<T, U = unknown>(arg: T, optionalArg?: U): void {
  if (optionalArg !== undefined) {
    console.log(arg, optionalArg)
  } else {
    console.log(arg)
  }
}

// Generic function being used for filtering items below
function filterItems<T>(arr: T[], predicate: (item: T) => boolean): T[] {
  return arr.filter(predicate)
}
// Generic function as an arrow function
// const filterItems = <T>(arr: T[], predicate: (item: T) => boolean): T[] => arr.filter(predicate);

// Function to Detect Low Stock
const getLowStockBooks = filterItems<Book>(bookCollection, item => item.quantityInStock < 10)
consoleLogItem("\nBooks with Low Stock:")
getLowStockBooks.forEach(({ title, quantityInStock }) => {
  consoleLogItem(`"${title}" -- only ${quantityInStock} left in stock!`)
})

// Books over $20
const booksOverTwenty = filterItems<Book>(bookCollection, item => item.pricePerBook > 20)
consoleLogItem("\nBooks over $20:\n", booksOverTwenty)

// Books out of Stock
const booksOutOfStock = filterItems<Book>(bookCollection, item => item.quantityInStock == 0)
consoleLogItem("\nBooks out of stock:\n", booksOutOfStock)

// Return last book in list
function lastEl<T>(el: Array<T>): T | undefined {
  if (el.length === 0) {
    return undefined
  }
  return el[el.length - 1]
}

consoleLogItem("\nLast item in the Book Collection:")
consoleLogItem(lastEl(bookCollection))

// Sort by Price
function sortByPrice(books: Book[], ascending: boolean): Book[] {
  const newBooksArray = [...books]

  ascending === true ? newBooksArray.sort((priceA, priceB) => priceA.pricePerBook - priceB.pricePerBook) : newBooksArray.sort((priceA, priceB) => priceB.pricePerBook - priceA.pricePerBook)

  return newBooksArray
}
consoleLogItem("\nSorted by Price (Ascending):\n", sortByPrice(bookCollection, true))
consoleLogItem("\nSorted by Price (Descending):\n", sortByPrice(bookCollection, false))

// Sort by Stock
function sortByStock(books: Book[], ascending: boolean): Book[] {
  const newBooksArray = [...books]

  ascending === true ? newBooksArray.sort((stockA, stockB) => stockA.quantityInStock - stockB.quantityInStock) : newBooksArray.sort((stockA, stockB) => stockB.quantityInStock - stockA.quantityInStock)

  return newBooksArray
}
consoleLogItem("\nSorted by Stock (Ascending):\n", sortByStock(bookCollection, true))
consoleLogItem("\nSorted by Stock (Descending):\n", sortByStock(bookCollection, false))

// consoleLogItem((636.4375 + 1153.35 + 35.91 + 0 + 979.209 + 40.7745).toFixed(2));
consoleLogItem(`\nTotal inventory value: $${totalValue(bookCollection).toFixed(2)}`)

// Show Dashboard or Exit
function showDashboard(books: Book[]): void {
  let dashboardPrompt = true

  while (dashboardPrompt) {
    let booksInStock: number = 0
    const choice: string = prompt("\nPlease enter a choice: (1 = Show Bookstore Dashboard, 2 = Exit): ")
    consoleLogItem(`You chose: ${choice}`)

    if (Number(choice) === 1) {
      consoleLogItem("You are now being shown the dashboard...\n")
      consoleLogItem("========================================\n")
      consoleLogItem("         📊 BOOKSTORE DASHBOARD\n")
      consoleLogItem("========================================\n")

      books.forEach(({ quantityInStock }) => {
        if (quantityInStock > 0) {
          booksInStock += 1
        }
      })

      consoleLogItem(`📚 Total titles in stock: ${booksInStock}\n`)

      consoleLogItem(`💰 Total inventory value: $${totalValue(bookCollection).toFixed(2)}\n`)

      consoleLogItem("⚠️  Books low in stock:")
      getLowStockBooks.forEach(({ title, quantityInStock }) => {
        consoleLogItem(`"${title}" -- only ${quantityInStock} left in stock!`)
      })

      avgBookPrice(bookCollection)
    } else if (Number(choice) === 2) {
      consoleLogItem("You are now exiting the dashboard...")
      dashboardPrompt = false
    } else {
      consoleLogItem("Invalid choice. You must choose 1 or 2.\n")
    }
  }
}
showDashboard(bookCollection)

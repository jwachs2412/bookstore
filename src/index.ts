import { type } from "os"
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
    consoleLogItem(`\nBook not found: "${bookToFind}".\n`)
  }

  return updatedBooks

  //   if (book) {
  //     book.quantityInStock += quantityToAdd // directly mutates quantityInStock
  //   } else {
  //     consoleLogItem(`Book not found: "${bookToFind}."`)
  //   }

  //   return books
}

// consoleLogItem("\nBook collection after restock:")
// consoleLogItem(restockBook(bookCollection, "Programming TypeScript", 5))
// consoleLogItem(restockBook(bookCollection, "Hello World", 8))

// Function for a MarkDown Sale
function markDownSale(books: Book[], qualifyingPrice: number, discount: number): Book[] {
  //   let markedDownBooks: Book[] = []

  //   for (let i = 0; i < books.length; i++) {
  //     const book = books[i]
  //     if (book && book.pricePerBook > qualifyingPrice) {
  //       book.discount = discountAmt
  //       markedDownBooks.push(book)
  //     }
  //   }

  return books.map(book => (book.pricePerBook < qualifyingPrice ? { ...book, discount } : book))

  //   books.forEach(book => {
  //     if (book && book.pricePerBook > qualifyingPrice) {
  //       book.discount = discountAmt
  //       markedDownBooks.push(book)
  //     }
  //   })

  //   return markedDownBooks
}

// consoleLogItem("\nBooks Marked Down for Sale if under $30:")
// consoleLogItem(markDownSale(bookCollection, 30, 0.2))
// consoleLogItem("\nBooks Marked Down for Sale if under $18:")
// consoleLogItem(markDownSale(bookCollection, 18, 0.25))

// Generic function for console.log()
function consoleLogItem<T, U = unknown>(arg: T, optionalArg?: U): void {
  if (optionalArg !== undefined) {
    console.log(arg, optionalArg)
  } else {
    console.log(arg)
  }
}

// Generic function being used for filtering items below
function filterItems<T>(arr: T[], predicate: (item: T, compOp?: string, numForComparison?: number) => boolean, compOp?: string, numForComparison?: number): T[] {
  return arr.filter(item => predicate(item, compOp, numForComparison))
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

function filterByPrice(): void {
  type CompOp = ">" | "<" | "===" | "!=="
  let operandString: string = ""
  const priceToFilter: string = prompt("Enter a number for your price comparison: ")
  process.stdout.write("What comparison do you want to make? Please enter one of the following symbols: (greater than: >, less than: <, equal to: ===, not equal to: !==)\n")
  const compOp: CompOp = prompt("") as CompOp
  const priceUsed = filterItems<Book>(bookCollection, item => {
    switch (compOp) {
      case ">":
        operandString = "greater than"
        return item.pricePerBook > Number(priceToFilter)
      case "<":
        operandString = "less than"
        return item.pricePerBook < Number(priceToFilter)
      case "===":
        operandString = "equal to"
        return item.pricePerBook === Number(priceToFilter)
      case "!==":
        operandString = "not equal to"
        return item.pricePerBook !== Number(priceToFilter)
      default:
        return false
    }
  })
  consoleLogItem(`\nBooks ${operandString} $${priceToFilter}:\n`, priceUsed)
}

// Return last book in list
function lastEl<T>(el: Array<T>): T | undefined {
  if (el.length === 0) {
    return undefined
  }
  return el[el.length - 1]
}

consoleLogItem("\nLast item in the Book Collection:")
consoleLogItem(lastEl(bookCollection))

// Generic function for sorting
function sortBy<T>(arr: T[], key: keyof T, ascending: boolean): T[] {
  const newArray = [...arr]

  ascending === true ? newArray.sort((bookProp1, bookProp2) => (bookProp1[key] as number) - (bookProp2[key] as number)) : newArray.sort((bookProp1, bookProp2) => (bookProp2[key] as number) - (bookProp1[key] as number))

  return newArray
}

// Sort by Price
// function sortByPrice(books: Book[], ascending: boolean): Book[] {
//   const newBooksArray = [...books]

//   ascending === true ? newBooksArray.sort((priceA, priceB) => priceA.pricePerBook - priceB.pricePerBook) : newBooksArray.sort((priceA, priceB) => priceB.pricePerBook - priceA.pricePerBook)

//   return newBooksArray
// }
// consoleLogItem("\nSorted by Price (Ascending):\n", sortByPrice(bookCollection, true))
// consoleLogItem("\nSorted by Price (Descending):\n", sortByPrice(bookCollection, false))

// Sort by Price Using Generic sortBy Function
const sortByPriceUsingGenericFunction2 = sortBy<Book>(bookCollection, "pricePerBook", false)
consoleLogItem("Descending Sort by Price using Generic Function (sortBy): \n")
consoleLogItem(sortByPriceUsingGenericFunction2)

const sortByPriceUsingGenericFunction = sortBy<Book>(bookCollection, "pricePerBook", true)
consoleLogItem("Asending Sort by Price using Generic Function (sortBy): \n")
consoleLogItem(sortByPriceUsingGenericFunction)

// Sort by Stock
// function sortByStock(books: Book[], ascending: boolean): Book[] {
//   const newBooksArray = [...books]

//   ascending === true ? newBooksArray.sort((stockA, stockB) => stockA.quantityInStock - stockB.quantityInStock) : newBooksArray.sort((stockA, stockB) => stockB.quantityInStock - stockA.quantityInStock)

//   return newBooksArray
// }
// consoleLogItem("\nSorted by Stock (Ascending):\n", sortByStock(bookCollection, true))
// consoleLogItem("\nSorted by Stock (Descending):\n", sortByStock(bookCollection, false))

// Sort by Stock Using Generic sortBy Function
const sortByStockUsingGenericFunction = sortBy<Book>(bookCollection, "quantityInStock", false)
consoleLogItem("Descending Sort by Stock using Generic Function (sortBy): \n")
consoleLogItem(sortByStockUsingGenericFunction)

const sortByStockUsingGenericFunction2 = sortBy<Book>(bookCollection, "quantityInStock", true)
consoleLogItem("Ascending Sort by Stock using Generic Function (sortBy): \n")
consoleLogItem(sortByStockUsingGenericFunction2)

// consoleLogItem((636.4375 + 1153.35 + 35.91 + 0 + 979.209 + 40.7745).toFixed(2));
consoleLogItem(`\nTotal inventory value: $${totalValue(bookCollection).toFixed(2)}`)

type BookAction = { type: "restock book"; title: string; quantity: number } | { type: "markdown sale"; title: string; discount: number } | { type: "remove book"; title: string }

function handleBookAction(books: Book[], action: BookAction): Book[] | void {
  switch (action.type) {
    case "restock book": {
      consoleLogItem("\nBook collection after restock:")
      consoleLogItem(restockBook(bookCollection, "Programming TypeScript", 5))
      consoleLogItem(restockBook(bookCollection, "Hello World", 8))
      break
    }
    case "markdown sale": {
      consoleLogItem("\nBooks Marked Down for Sale if under $30:")
      consoleLogItem(markDownSale(bookCollection, 30, 0.2))
      consoleLogItem("\nBooks Marked Down for Sale if under $18:")
      consoleLogItem(markDownSale(bookCollection, 18, 0.25))
      break
    }
    case "remove book": {
      books.forEach(({ title }, idx) => {
        console.log(`${idx + 1}: ${title}`)
      })
      process.stdout.write("\nWhich book title would you like to remove. Please enter the corresponding number from the list above: ")
      const choice: number = Number(prompt(""))
      const bookToRemove = books.splice(choice + 1, 1)
      consoleLogItem(`Removing book: ${bookToRemove}.`)
      consoleLogItem(books)
      break
    }
  }
}

// bookCollection.forEach(({ title }, idx) => {
//   console.log(`${idx + 1}: ${title}`)
// })

// Show Dashboard or Exit
function showDashboard(books: Book[]): void {
  let dashboardPrompt: boolean = true

  while (dashboardPrompt) {
    process.stdout.write("\nPlease enter a choice: (1 = Show Bookstore Dashboard Menu, 2 = Exit): \n")
    const choice: string = prompt("")
    consoleLogItem(`You chose: ${choice}`)

    if (Number(choice) === 1) {
      let dashboardMenu: boolean = true

      consoleLogItem("You are now being shown the dashboard...\n")
      consoleLogItem("========================================\n")
      consoleLogItem("         📊 BOOKSTORE DASHBOARD\n")
      consoleLogItem("========================================\n")

      while (dashboardMenu) {
        process.stdout.write("\nWhat would you like to view (enter the corresponding number)? \n1. Total Titles in Stock \n2. Total Inventory Value \n3. Books Low in Stock \n4. Average Book Price \n5. Filter By Price \n6. Books Out of Stock \n7. Book Action \n8. Exit\nYour Choice: ")
        const dashboardMenuChoice: string = prompt("")

        let booksInStock: number = 0

        books.forEach(({ quantityInStock }) => {
          if (quantityInStock > 0) {
            booksInStock += 1
          }
        })

        switch (dashboardMenuChoice) {
          case "1": {
            consoleLogItem(`\n📚 Total titles in stock: ${booksInStock}\n`)
            break
          }
          case "2": {
            consoleLogItem(`\n💰 Total inventory value: $${totalValue(bookCollection).toFixed(2)}\n`)
            break
          }
          case "3": {
            consoleLogItem("\n⚠️  Books low in stock:")
            getLowStockBooks.forEach(({ title, quantityInStock }) => {
              consoleLogItem(`"${title}" -- only ${quantityInStock} left in stock!`)
            })
            break
          }
          case "4": {
            avgBookPrice(bookCollection)
            break
          }
          case "5": {
            consoleLogItem("Filter By Price:")
            filterByPrice()
            break
          }
          case "6": {
            consoleLogItem("\nBooks out of stock:\n", booksOutOfStock)
            break
          }
          case "7": {
            process.stdout.write("What action would you like to take? ('restock book', 'markdown sale', 'remove book'): ")
            const bookActionToTake: string = prompt("")
            // handleBookAction(bookCollection, bookActionToTake)
            break
          }
          case "8": {
            console.log("Exiting the Bookstore Dashboard Menu")
            dashboardMenu = false
            break
          }
        }
      }
    } else if (Number(choice) === 2) {
      consoleLogItem("You are now exiting the dashboard...")
      dashboardPrompt = false
    } else {
      consoleLogItem("Invalid choice. You must choose 1 or 2.\n")
    }
  }
}
showDashboard(bookCollection)

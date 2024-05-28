const DataLoader = require('dataloader')
const Book = require('./models/book')

const bookCountLoader = new DataLoader(async (authorIds) => {
  const books = await Book.find({ author: { $in: authorIds } })
  return authorIds.map(authorId => {
    return books.filter(book => book.author.toString() === authorId.toString()).length
  })
})

module.exports = { bookCountLoader }
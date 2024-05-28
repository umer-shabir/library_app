import { useState } from 'react'
import { useQuery } from '@apollo/client'

import { ALL_BOOKS, ALL_GENRES } from '../queries'

const Books = () => {
  const [genreFilter, setGenreFilter] = useState(null)

  const genreResult = useQuery(ALL_GENRES)
  const filteredBooksResult = useQuery(ALL_BOOKS, {
    variables: { genre: genreFilter }
  })

  if (genreResult.loading || filteredBooksResult.loading) {
    return <div className="text-2xl font-mono font-bold text-left sm:px-16 px-8 py-4">loading...</div>
  }

  const genres = genreResult.data.allBooks.reduce((genres, book) => {
    book.genres.forEach(genre => {
      if (!genres.includes(genre)) {
        genres.push(genre)
      }
    })

    return genres
  }, [])



  const books = filteredBooksResult.data.allBooks

  return (
    <div className="relative overflow-x-auto">
      <h2 className="text-2xl font-mono font-bold text-left sm:px-16 px-8 py-4">Books</h2>
      <h4 className="text-md font-mono font-bold text-center sm:px-16 px-8 py-4">In Genre: {genreFilter ?? 'All genres'}</h4>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-sm text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="sm:px-16 px-8 py-3">Book</th>
            <th scope="col" className="sm:px-16 px-8 py-3">Author</th>
            <th scope="col" className="sm:px-16 px-8 py-3">Published</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr className="odd:bg-white even:bg-gray-50 border-b" key={book.id}>
              <th scope="row" className="sm:px-16 px-8 py-4 font-semibold text-gray-600 whitespace-nowrap">{book.title}</th>
              <td className="sm:px-16 px-8 py-4">{book.author.name}</td>
              <td className="sm:px-16 px-8 py-4">{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
        <h3 className="text-md font-mono font-bold text-left sm:px-16 px-8 py-4">Filter</h3>
        {genres.map(genre => (
          <button className="text-white bg-gradient-to-r from-blue-400 via-cyan-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 mt-4 ml-14" key={genre} onClick={() => setGenreFilter(genre)}>{genre}</button>
        ))}
        <br />
        <button className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 mt-4 ml-14" onClick={() => setGenreFilter(null)}>Reset Filter</button>
    </div>
  )
}

export default Books
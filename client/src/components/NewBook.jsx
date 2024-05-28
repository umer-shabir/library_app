import { useState } from 'react'
import { useMutation } from '@apollo/client'

import { ALL_AUTHORS, ALL_BOOKS, ALL_GENRES, CREATE_BOOK } from '../queries'
import { updateCache } from '../App'

const NewBook = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [ createBook ] = useMutation(CREATE_BOOK, {
    refetchQueries: [ { query: ALL_AUTHORS } ],
    update: (cache, response) => {
      const addedBook = response.data.addBook
      const { title, genres, __typename } = addedBook
      addedBook.genres.forEach(bookGenre => {
        updateCache(cache, { query: ALL_BOOKS, variables: { genre: bookGenre } }, addedBook)
      })
      updateCache(cache, { query: ALL_BOOKS, variables: { genre: null } }, addedBook)
      updateCache(cache, { query: ALL_GENRES }, { title, genres, __typename })
    }
  })

  const submit = async (event) => {
    event.preventDefault()

    const publishedYear = parseInt(published)
    createBook({ variables: { title, author, published: publishedYear, genres }})
    console.log('add book...')

    setTitle('')
    setAuthor('')
    setPublished('')
    setGenre('')
    setGenres([])
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <form className="max-w-sm mx-auto px-3" onSubmit={submit}>
        <div className="mb-5">
          <label htmlFor="title" className="block mb-2 text-md font-semibold text-gray-900">Title</label>
          <input type="text" id="title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" value={title} onChange={({ target }) => setTitle(target.value)} />
        </div>
        <div className="mb-5">
          <label htmlFor="author" className="block mb-2 text-md font-semibold text-gray-900">Author</label>
          <input type="text" id="author" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" value={author} onChange={({ target }) => setAuthor(target.value)} />
        </div>
        <div className="mb-5">
          <label htmlFor="published" className="block mb-2 text-md font-semibold text-gray-900">Published</label>
          <input type="number" id="published" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" value={published} onChange={({ target }) => setPublished(target.value)} />
        </div>
        <div className="mb-5">
          <label htmlFor="genre" className="block mb-2 text-md font-semibold text-gray-900">Genre</label>
          <input type="text" id="genre" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" value={genre} onChange={({ target }) => setGenre(target.value)} />
          <button className="text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center mt-5" onClick={addGenre} type="button">Add Genre</button>
        </div>
        <div className="mb-5 block text-lg font-semibold text-gray-900">Genres: {genres.join(' ')}</div>
        <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center" type="submit">Create Book</button>
      </form>
    </div>
  )
}

export default NewBook
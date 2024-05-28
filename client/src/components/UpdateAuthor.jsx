import { useState } from 'react'
import Select from 'react-select'
import { useMutation, useQuery } from '@apollo/client'

import { ALL_AUTHORS, UPDATE_AUTHOR } from '../queries'

const UpdateAuthor = () => {
  const [selectAuthor, setselectAuthor] = useState(null)
  const [born, setBorn] = useState('')
  const authorsResult = useQuery(ALL_AUTHORS)

  const [ updateAuthor ] = useMutation(UPDATE_AUTHOR, {
    update: (cache, response) => {
      cache.updateQuery({ query: ALL_AUTHORS }, ({ allAuthors }) => {
        return {
          allAuthors: allAuthors.map(author => author.id === response.data.editAuthor.id ? response.data.editAuthor : author)
        }
      })
    }
  })
  
  if (authorsResult.loading) {
    return <div className="text-2xl font-mono font-bold text-left sm:px-16 px-8 py-4">loading...</div>
  }

  const authors = authorsResult.data.allAuthors

  const authorNames = authors ? authors.map((author) => author.name) : []


  const submit = async (event) => {
    event.preventDefault()

    const birthYear = parseInt(born)
    updateAuthor({ variables: { name: selectAuthor.value, born: birthYear } })

    setBorn('')
  }

  const options = authorNames.map((author) => {
    return {
      value: author,
      label: author
    }
  })

  return (
    <div>
      <form className="max-w-sm mx-auto px-3" onSubmit={submit}>
        <div className="mb-5">
          <label htmlFor="name" className="block mb-2 text-md font-semibold text-gray-900">Name</label>
          <Select defaultValue={options[0].value} onChange={setselectAuthor} options={options} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
        </div>
        <div className="mb-5">
          <label htmlFor="born" className="block mb-2 text-md font-semibold text-gray-900">Born</label>
          <input type="number" id="born" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" value={born} onChange={({ target }) => setBorn(target.value)} />
        </div>
        <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center" type="submit">Update Author</button>
      </form>
    </div>
  )
}

export default UpdateAuthor
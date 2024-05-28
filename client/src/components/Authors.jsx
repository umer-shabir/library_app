import { useQuery } from '@apollo/client'
import { ALL_AUTHORS } from '../queries'

const Authors = () => {
  const authorsResult = useQuery(ALL_AUTHORS)

  if (authorsResult.loading) {
    return <div className="text-2xl font-mono font-bold text-left sm:px-16 px-8 py-4">loading...</div>
  }

  const authors = authorsResult.data.allAuthors

  return (
    <div className="relative overflow-x-auto">
      <h2 className="text-2xl font-mono font-bold text-left sm:px-16 px-8 py-4">Authors</h2>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-sm text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="sm:px-16 px-8 py-3">Name</th>
            <th scope="col" className="sm:px-16 px-8 py-3">Born</th>
            <th scope="col" className="sm:px-16 px-8 py-3">Books</th>
          </tr>
        </thead>
        <tbody>
          {authors.map((author) => (
            <tr className="odd:bg-white even:bg-gray-50 border-b" key={author.id}>
              <th scope="row" className="sm:px-16 px-8 py-4 font-semibold text-gray-600 whitespace-nowrap">{author.name}</th>
              <td className="sm:px-16 px-8 py-4">{author.born}</td>
              <td className="sm:px-16 px-8 py-4">{author.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Authors
import { useQuery } from '@apollo/client'
import { ALL_BOOKS, CURRENT_USER } from '../queries'

const Recommned = () => {
  const currentUserResult = useQuery(CURRENT_USER)
  const recommendedBooksResult = useQuery(ALL_BOOKS, {
    skip: !currentUserResult.data,
    variables: { genre: currentUserResult.data?.me?.favoriteGenre }
  })

  if (currentUserResult.loading || recommendedBooksResult.loading) {
    return <div className="text-2xl font-mono font-bold text-left sm:px-16 px-8 py-4">loading...</div>
  }

  return (
    <div className="relative overflow-x-auto">
      <h2 className="text-2xl font-mono font-bold text-left sm:px-16 px-8 py-4">Recommendations</h2>
      <h4 className="text-md font-mono font-bold text-center sm:px-16 px-8 py-4">Books in your favorite genre: {currentUserResult.data.me.favoriteGenre}</h4>

      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-sm text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="sm:px-16 px-8 py-3">Book</th>
            <th scope="col" className="sm:px-16 px-8 py-3">Author</th>
            <th scope="col" className="sm:px-16 px-8 py-3">Published</th>
          </tr>
        </thead>
        <tbody>
          {recommendedBooksResult.data.allBooks.map((book) => (
            <tr className="odd:bg-white even:bg-gray-50 border-b" key={book.id}>
              <th scope="row" className="sm:px-16 px-8 py-4 font-semibold text-gray-600 whitespace-nowrap">{book.title}</th>
              <td className="sm:px-16 px-8 py-4">{book.author.name}</td>
              <td className="sm:px-16 px-8 py-4">{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommned
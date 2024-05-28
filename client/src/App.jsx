import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import { useState } from 'react'

import { useApolloClient, useSubscription } from '@apollo/client'

import { ALL_BOOKS, ALL_GENRES, BOOK_ADDED } from './queries'

import Books from './components/Books'
import NewBook from './components/NewBook'
import Authors from './components/Authors'
import UpdateAuthor from './components/UpdateAuthor'
import Recommned from './components/Recommend'
import LoginForm from './components/LoginForm'

import librarySvg from './assets/library.svg'
import hamburgerMenu from './assets/hamburger.svg'

export const updateCache = (cache, query, addedBook) => {
  const uniqByTitle = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, (data) => {
    if (data) {
      return {
        allBooks: uniqByTitle(data.allBooks.concat(addedBook)),
      }
    }
  })
}

const App = () => {
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded
      const { title, genres, __typename } = addedBook
      window.alert(`A new book '${addedBook.title}' by '${addedBook.author.name}' added`)
      addedBook.genres.forEach(bookGenre => {
        updateCache(client.cache, { query: ALL_BOOKS, variables: { genre: bookGenre } }, addedBook)
      })
      updateCache(client.cache, { query: ALL_BOOKS, variables: { genre: null } }, addedBook)
      updateCache(client.cache, { query: ALL_GENRES }, { title, genres, __typename })
    }
  })

  const logout = async () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <Router>
      <header className="sm:px-16 px-8 py-8 w-full">
        <nav className="flex justify-between items-center max-container">
          <a href="/" className="flex items-center space-x-3">
            <img src={librarySvg} alt="Library Logo" width={40} height={29} />
            <span className="self-center text-4xl font-bold leading-normal whitespace-nowrap">Library</span>
          </a>
          <ul className="flex-1 flex justify-center items-center gap-16 max-lg:hidden">
            <li>
              <Link className="leading-normal text-2xl text-slate-600" to="/">Books</Link>
            </li>
            {token
              ? <li><Link className="leading-normal text-2xl text-slate-600" to="/addBook">Add Book</Link></li>
              : null
            }
            <li>
              <Link className="leading-normal text-2xl text-slate-600" to="/authors">Authors</Link>
            </li>
            {token
              ? <li><Link className="leading-normal text-2xl text-slate-600" to="/updateAuthor">Update Author</Link></li>
              : null
            }
            {token
              ? <li><Link className="leading-normal text-2xl text-slate-600" to="/recommend">Recommend</Link></li>
              : null
            }
            {token
              ? <li><button onClick={logout} className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Logout</button></li>
              : <li><Link className="leading-normal text-2xl text-slate-600" to="/login"><button className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Login</button></Link></li>
            }
          </ul>
          <div className="hidden max-lg:block">
            <img src={hamburgerMenu} alt="Menu" width={25} height={25} />
          </div>
        </nav>
      </header>
                
      <Routes>
        <Route path="/" element={<Books />}></Route>
        <Route path="/addBook" element={token ? <NewBook /> : <Navigate replace to="/login" />}></Route>
        <Route path="/authors" element={<Authors />}></Route>
        <Route path="/updateAuthor" element={token ? <UpdateAuthor /> : <Navigate replace to="/login" />}></Route>
        <Route path="/recommend" element={token ? <Recommned /> : <Navigate replace to="/login" />}></Route>
        <Route path="/login" element={<LoginForm setToken={setToken} />}></Route>
      </Routes>
    </Router>
  )
}

export default App
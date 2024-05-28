import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@apollo/client'
import { LOGIN, CURRENT_USER } from '../queries'

const LoginForm = ({ setToken }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const { refetch: refetchCurrentUser } = useQuery(CURRENT_USER)
  const [ login, result ] = useMutation(LOGIN, {
    onError: (error) => {
      console.log(error.graphQLErrors[0].message)
    }
  })

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('library-login-token', token)
      refetchCurrentUser()
      navigate('/')
    }
  }, [result.data])

  const submit = (event) => {
    event.preventDefault()
    login({ variables: { username, password } })
    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <form onSubmit={submit} className="max-w-sm mx-auto px-3" >
        <h2 className="text-2xl font-mono font-bold text-left my-8">Login</h2>
        <div className="mb-5">
          <label htmlFor="username" className="block mb-2 text-md font-semibold text-gray-900">Username</label>
          <input type="text" id="username" value={username} onChange={({ target }) => setUsername(target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
        </div>
        <div className="mb-5">
          <label htmlFor="password" className="block mb-2 text-md font-semibold text-gray-900">Password</label>
          <input type="password" id="password" value={password} onChange={({ target }) => setPassword(target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
        </div>
        <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg w-full sm:w-auto px-5 py-2.5 my-5 text-center" type="submit">Sign in</button>
      </form>
    </div>
  )
}

export default LoginForm
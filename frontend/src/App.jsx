import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [users, setUsers] = useState([])
  const [name, setName] = useState('')

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5001/users')
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name) return

    try {
      const response = await fetch('http://localhost:5001/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      })
      if (response.ok) {
        setName('')
        fetchUsers()
      }
    } catch (error) {
      console.error('Error adding user:', error)
    }
  }

  return (
    <div className="App">
      <h1>User Registry</h1>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter user name"
          />
          <button type="submit">Add User</button>
        </form>
      </div>

      <div className="user-list">
        <h2>Users</h2>
        {users.length === 0 ? (
          <p>No users found</p>
        ) : (
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                {user.name} <small>({new Date(user.created_at).toLocaleString()})</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default App

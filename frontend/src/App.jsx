import { useState, useEffect } from 'react'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

export default function App() {
  const [tasks, setTasks] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [loading, setLoading] = useState(true)

  // 1. READ: Fetch tasks from Python API
  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/tasks`)
      const data = await res.json()
      setTasks(data)
    } catch (err) {
      console.error("Error fetching tasks:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTasks() }, [])

  // 2. CREATE: Add new task
  const handleAddTask = async (e) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    await fetch(`${API_BASE_URL}/api/tasks?title=${encodeURIComponent(newTitle)}`, {
      method: 'POST'
    })
    setNewTitle('')
    fetchTasks()
  }

  // 3. UPDATE: Toggle complete status
  const handleToggle = async (id) => {
    await fetch(`${API_BASE_URL}/api/tasks/${id}`, { method: 'PUT' })
    fetchTasks()
  }

  // 4. DELETE: Remove task
  const handleDelete = async (id) => {
    await fetch(`${API_BASE_URL}/api/tasks/${id}`, { method: 'DELETE' })
    fetchTasks()
  }

  return (
    <div style={{ maxWidth: '450px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>📋 Full-Stack Task Tracker</h2>

      <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <input 
          type="text" 
          value={newTitle} 
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="What needs to be done?"
          style={{ flex: 1, padding: '8px' }}
        />
        <button type="submit" style={{ padding: '8px 16px' }}>Add Task</button>
      </form>

      {loading ? <p>Loading tasks from Python backend...</p> : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tasks.map((task) => (
            <li key={task.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #ccc' }}>
              <span 
                onClick={() => handleToggle(task.id)}
                style={{ textDecoration: task.completed ? 'line-through' : 'none', cursor: 'pointer' }}
              >
                {task.completed ? "✅ " : "⏳ "} {task.title}
              </span>
              <button onClick={() => handleDelete(task.id)} style={{ color: 'red' }}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
import { useSelector, useDispatch } from 'react-redux'
import { increment, decrement } from './features/counter/counterSlice'
import Users from './componenets/Users'
import Home from './componenets/Home'
import { Routes, Route, Link, Navigate } from 'react-router-dom'

function App() {
  const count = useSelector((state) => state.counter.value)
  const dispatch = useDispatch()

  return (
    <div>
      <nav style={{ padding: '10px', background: '#f0f0f0', marginBottom: '20px' }}>
        <Link to="/home" style={{ marginRight: '15px' }}>Home</Link>
        <Link to="/users">Users</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/users" element={
          <div>
            <h1>{count}</h1>
            <button onClick={() => dispatch(increment())}>+</button>
            <button onClick={() => dispatch(decrement())}>-</button>
            <Users />
          </div>
        } />
      </Routes>
    </div>
  )
}

export default App
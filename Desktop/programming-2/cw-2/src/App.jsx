import { useState } from 'react'
import LoginPage from './pages/LoginPage'
import SignUp from './pages/SignUp';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <LoginPage />;
    </>
  )
}

export default App

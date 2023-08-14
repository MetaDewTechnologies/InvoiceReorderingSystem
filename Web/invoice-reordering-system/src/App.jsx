import { useState } from 'react'
import './App.css'
import { ThemeProvider } from '@material-ui/core';
import theme from './theme';
import LoginView from './views/auth/LoginView'
import GlobalStyles from './components/GlobalStyles';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <ThemeProvider theme={theme}>
        <GlobalStyles />
          <LoginView/>
        </ThemeProvider>
    </>
  )
}

export default App

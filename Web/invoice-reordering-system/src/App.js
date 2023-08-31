import { useState } from 'react'
import { ThemeProvider } from '@material-ui/core';
import theme from './theme';
import GlobalStyles from './components/GlobalStyles';
import { useRoutes } from 'react-router-dom';
import routes from './routes';
import authService from '../src/helpers/AuthService'

function App() {
  let isLoggedIn = authService.IsUserLogged();
  let role = sessionStorage.getItem('role')
  const routing = useRoutes(routes(isLoggedIn,role));
  return (
    <div className="App">
        <ThemeProvider theme={theme}>
          <GlobalStyles />
            {routing}
        </ThemeProvider>
    </div>
  );
}

export default App;

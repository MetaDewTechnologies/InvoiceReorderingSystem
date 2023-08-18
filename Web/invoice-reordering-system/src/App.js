import { useState } from 'react'
import { ThemeProvider } from '@material-ui/core';
import theme from './theme';
import GlobalStyles from './components/GlobalStyles';
import { useRoutes } from 'react-router-dom';
import routes from './routes';

function App() {
  let isLoggedIn = true//authService.IsUserLogged();

  const routing = useRoutes(routes(isLoggedIn));
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

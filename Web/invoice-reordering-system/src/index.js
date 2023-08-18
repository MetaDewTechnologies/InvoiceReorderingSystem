// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App';
// import { BrowserRouter } from 'react-router-dom';
// import { transitions, positions, Provider as AlertProvider } from 'react-alert'
// import AlertTemplate from 'react-alert-template-basic'
// const root = ReactDOM.createRoot(document.getElementById('root'));

// // optional configuration
// const options = {
//   // you can also just use 'bottom center'
//   position: positions.BOTTOM_RIGHT,
//   timeout: 5000,
//   offset: '30px',
//   // you can also just use 'scale'
//   transition: transitions.SCALE
// }

// const Root = () => (
//   <AlertProvider template={AlertTemplate} {...options}>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </AlertProvider>
// )

// root.render(<Root />);


import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'
import App from './App';

// optional configuration
const options = {
  // you can also just use 'bottom center'
  position: positions.BOTTOM_RIGHT,
  timeout: 5000,
  offset: '30px',
  // you can also just use 'scale'
  transition: transitions.SCALE
}

const Root = () => (
  <AlertProvider template={AlertTemplate} {...options}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AlertProvider>
)

render(<Root />, document.getElementById('root'));

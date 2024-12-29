import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { StyledEngineProvider } from '@mui/material/styles';
import { store } from './redux/store'; 
import './index.scss';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.Fragment>
    <StyledEngineProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </StyledEngineProvider>
  </React.Fragment>
);
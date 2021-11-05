import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter as Router} from 'react-router-dom'
import App from './App';
import {ContextProvider} from './Context'
import ScrollToTop from './ScrollToTop'

ReactDOM.render(
    <Router>
      <ContextProvider>
      <ScrollToTop/>
      <App />
      </ContextProvider>
    </Router>
  ,
  document.getElementById('root')
);



import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

if (process.env.REACT_APP_DEV) {
	require('./mock');
}

ReactDOM.render(<App />, document.getElementById('root'));

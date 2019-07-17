import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import Board from "./components/Board"
import * as serviceWorker from './serviceWorker';

ReactDOM.render( <Board />, document.getElementById( 'root' ) );

serviceWorker.unregister();

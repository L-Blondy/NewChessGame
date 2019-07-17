import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import Board from "./components/Board"
import FullScreenBtn from "./components/FullScreenBtn"
import * as serviceWorker from './serviceWorker';

ReactDOM.render( <><Board /><FullScreenBtn /></>, document.getElementById( 'root' ) );

serviceWorker.unregister();

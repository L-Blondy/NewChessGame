import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import Game from "./components/Game"
import Board from "./components/Board"
import * as serviceWorker from './serviceWorker';

ReactDOM.render( <Game />, document.getElementById( 'root' ) );

serviceWorker.unregister();

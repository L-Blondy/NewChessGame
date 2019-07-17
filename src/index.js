import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import Board from "./components/Board"
import FullScreenBtn from "./components/FullScreenBtn"
import BlackLostPieces from "./components/BlackLostPieces"
import { Provider } from 'react-redux';
import { store } from "./reduxStore/Store"
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
	<Provider store={ store }>
		<FullScreenBtn />
		<Board />
		<BlackLostPieces />
	</Provider>,
	document.getElementById( 'root' ) );

serviceWorker.unregister();

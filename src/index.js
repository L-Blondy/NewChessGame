import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import Board from "./components/Board"
import FullScreenBtn from "./components/FullScreenBtn"
import { WhiteLostPieces, BlackLostPieces } from "./components/LostPieces"
import { Provider } from 'react-redux';
import { store } from "./reduxStore/Store"
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
	<div className="App">
		<FullScreenBtn />
		<Provider store={ store }>

			<BlackLostPieces />
			<Board />
			<WhiteLostPieces />
		</Provider>
	</div>,

	document.getElementById( 'root' )
);

serviceWorker.unregister();

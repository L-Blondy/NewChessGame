import React from "react";
import Square from "./Square";
import { Knight, EmptySlot, Rook, Bishop, Queen, King, Pawn } from "../pieces/Pieces.js";
import { rotateBkg, verifyChessMate, getPossibleMoves, getRock, getPawnEatingMoves, movePiece, changePawnToQueen, handleRock, animatePiece } from "../helpers/helpers"
import { connect } from "react-redux";
import { store } from "../reduxStore/Store";
import _ from 'lodash';

const initialBoard = [
	[ new Rook( "white" ), new Knight( "white" ), new Bishop( "white" ), new King( "white" ), new Queen( "white" ), new Bishop( "white" ), new Knight( "white" ), new Rook( "white" ) ],
	[ new Pawn( "white" ), new EmptySlot( "white" ), new Pawn( "white" ), new EmptySlot( "white" ), new EmptySlot( "white" ), new Pawn( "white" ), new EmptySlot( "white" ), new Pawn( "white" ) ],
	[ new EmptySlot(), new EmptySlot(), new EmptySlot(), new EmptySlot(), new EmptySlot(), new Queen( "white" ), new EmptySlot(), new EmptySlot() ],
	[ new EmptySlot(), new EmptySlot(), new EmptySlot(), new EmptySlot(), new EmptySlot(), new EmptySlot(), new EmptySlot(), new EmptySlot() ],
	[ new EmptySlot(), new EmptySlot(), new EmptySlot(), new EmptySlot(), new EmptySlot(), new EmptySlot(), new EmptySlot(), new EmptySlot() ],
	[ new EmptySlot(), new EmptySlot(), new EmptySlot(), new EmptySlot(), new EmptySlot(), new EmptySlot(), new EmptySlot(), new EmptySlot() ],
	[ new Pawn( "black" ), new Pawn( "black" ), new EmptySlot( "black" ), new Pawn( "black" ), new EmptySlot( "black" ), new Pawn( "white" ), new EmptySlot( "black" ), new Pawn( "black" ) ],
	[ new Rook( "black" ), new EmptySlot( "black" ), new EmptySlot( "black" ), new King( "black" ), new EmptySlot( "black" ), new EmptySlot( "black" ), new EmptySlot( "black" ), new Rook( "black" ) ],
].map( ( line, row ) => line.map( ( piece, col ) => {
	piece.coord = { col, row }
	return piece;
} ) )

class Board extends React.Component {

	state = {
		board: initialBoard,
		currentPlayer: "black",
		selectedCoord: {},
		StartingCoord: {},
		LoM: { possibleMoves: [], possibleEat: [], possibleRock: [], possibleChess: false },
		lostPieces: {
			white: [],
			black: []
		},
		chessMate: false,
		prevState: {}
	}

	componentDidUpdate = () => {
		// handle UNDO
		if ( this.props.undo ) {
			console.log( this.state.prevState.lostPieces )
			this.setState( this.state.prevState );
			store.dispatch( { type: "TOGGLE_UNDO" } )
			store.dispatch( { type: "RELOAD_LOST_PIECES", payload: this.state.prevState.lostPieces } )
			store.dispatch( { type: "SUB_MOVE" } )
		}
	}

	handleClick = ( piece, e ) => {
		const stateCopy = _.cloneDeep( this.state )
		let { board, currentPlayer, selectedCoord, lostPieces } = { ...stateCopy };
		const hasSelectedPieceToMove = piece.color === currentPlayer && ( piece.coord.col !== selectedCoord.col || piece.coord.row !== selectedCoord.row )
		const validMove = ( piece.coord.col !== selectedCoord.col || piece.coord.row !== selectedCoord.row ) && ( piece.color === currentPlayer || e.target.classList.contains( "possibleMove" ) || e.target.classList.contains( "possibleEat" ) || e.target.classList.contains( "possibleRock" ) );

		/******************
		 *  SELECTING PIECE TO MOVE
		 */
		if ( hasSelectedPieceToMove ) {
			const StartingCoord = { y: e.target.getBoundingClientRect().top, x: e.target.getBoundingClientRect().left };
			this.setState( {
				StartingCoord: StartingCoord
			} )

			let LoM = getPossibleMoves( board, stateCopy.currentPlayer, piece )

			if ( piece.name === "King" && piece.firstMove ) {
				LoM = { ...LoM, ...getRock( _.cloneDeep( stateCopy ), piece ) }
			}

			if ( piece.name === "Pawn" ) {
				LoM = { ...LoM, ...getPawnEatingMoves( board, currentPlayer, stateCopy.firstMoveWeakness, piece, LoM ) }
			}

			this.setState( {
				LoM,
				selectedCoord: piece.coord
			} )
			return
		}

		/******************
		 * INVALID MOVE
		 */
		else if ( !validMove ) {
			this.setState( {
				selectedCoord: {},
				LoM: { possibleMoves: [], possibleEat: [], possibleRock: [] },
				StartingCoord: {},
			} )
		}

		/******************
		 * VALID MOVE
		 */
		else if ( validMove ) {
			const EndingCoord = { y: e.target.getBoundingClientRect().top, x: e.target.getBoundingClientRect().left };
			const nextPlayer = currentPlayer === "black" ? "white" : "black";
			const playedPiece = board[ selectedCoord.row ][ selectedCoord.col ]
			const { col, row } = piece.coord;
			const ateFromBehind = stateCopy.firstMoveWeakness && playedPiece.name === "Pawn" && col === stateCopy.firstMoveWeakness.col && row === stateCopy.firstMoveWeakness.row;
			const ateSomething = board[ piece.coord.row ][ piece.coord.col ].name;
			const direction = playedPiece.direction;
			const pawnDoubleMove = playedPiece.name === "Pawn" && ( row === 3 || row === 4 );
			const didRock = e.target.classList.contains( "possibleRock" );
			let firstMoveWeakness = null;

			// save previous state in case of future UNDO
			this.setState( {
				prevState: {
					currentPlayer,
					board: stateCopy.board.map( line => [ ...line ] ),
					selectedCoord: {},
					StartingCoord: {},
					LoM: { possibleMoves: [], possibleEat: [], possibleRock: [], possibleChess: false },
					lostPieces: {
						white: stateCopy.lostPieces.white.slice(),
						black: stateCopy.lostPieces.black.slice()
					},
					chessMate: false,
					prevState: this.state.prevState
				}
			} )

			//trigger animation
			animatePiece( stateCopy.StartingCoord, EndingCoord, e.target );

			// update lost pieces
			if ( ateSomething ) {
				if ( currentPlayer === "black" ) {
					store.dispatch( {
						type: "ADD_WHITE",
						payload: { ...board[ row ][ col ] }
					} );
				}
				else if ( currentPlayer === "white" ) {
					store.dispatch( {
						type: "ADD_BLACK",
						payload: { ...board[ row ][ col ] }
					} );
				}
				lostPieces[ nextPlayer ] = [ ...lostPieces[ nextPlayer ], { ...board[ row ][ col ] } ]
			}

			//update the board copy with the move
			board = movePiece( board, selectedCoord, piece.coord );

			//handle Rock if Rocked
			if ( didRock ) {
				board = handleRock( board, piece.coord )
			}

			// handle eat after Pion makes double move as first move
			else if ( ateFromBehind ) {
				lostPieces[ nextPlayer ] = [ ...lostPieces[ nextPlayer ], { ...board[ row - direction ][ col ] } ]
				board[ row - direction ][ col ] = Object.assign( {}, new EmptySlot(), { coord: { row: row - direction, col } } )
			}

			//handle first move : 1. pass firstMove to false, 2. set firstMoveWeakness if Pion made a double move
			if ( playedPiece.firstMove ) {
				board[ piece.coord.row ][ piece.coord.col ].handleFirstMove()

				if ( pawnDoubleMove ) {
					board[ row - direction ][ col ] = Object.assign( board[ row - direction ][ col ], { firstMoveWeakness: true } )
					firstMoveWeakness = { col, row: row - direction }
				}
			}

			//Transform Pion to Queen if needed
			if ( board[ piece.coord.row ][ piece.coord.col ].name === "Pawn" && ( piece.coord.row === 0 || piece.coord.row === 7 ) )
				board = changePawnToQueen( board, piece.coord, currentPlayer ) //pawn becomes queen on last row

			//Change current Player in global Store
			store.dispatch( {
				type: "SWITCH_PLAYER",
				payload: nextPlayer
			} )

			//increase move counter by 1 in global state
			store.dispatch( {
				type: "ADD_MOVE",
			} )

			//rotate board bkg
			rotateBkg( currentPlayer )

			//update the state
			this.setState( {
				board: board,
				selectedCoord: {},
				LoM: { possibleMoves: [], possibleEat: [], possibleRock: [] },
				currentPlayer: nextPlayer,
				firstMoveWeakness,
				StartingCoord: {},
				chessMate: verifyChessMate( board, currentPlayer )
			} )
		}
	}

	// get Class Name during rendering process
	getClassName = ( state, col, row ) => {
		let boardCopy = state.board.map( line => [ ...line ] );
		const { selectedCoord, LoM, currentPlayer } = { ...state };
		let className = " ";

		if ( boardCopy[ row ][ col ].color ) {
			className += ( boardCopy[ row ][ col ].color + "Piece " )
		}
		if ( boardCopy[ row ][ col ].color === currentPlayer ) {
			className += "playing "
		}
		if ( selectedCoord.col === col && selectedCoord.row === row ) {
			return className += "isSelected ";
		}
		if ( "forbiddenMoves" in LoM ) {
			for ( let i = 0; i < LoM.forbiddenMoves.length; i++ ) {
				if ( LoM.forbiddenMoves[ i ].col === col && LoM.forbiddenMoves[ i ].row === row ) {
					return className += "forbiddenMove ";
				}
			}
		}
		if ( "possibleMoves" in LoM ) {
			for ( let i = 0; i < LoM.possibleMoves.length; i++ ) {
				if ( LoM.possibleMoves[ i ].col === col && LoM.possibleMoves[ i ].row === row ) {
					return className += "possibleMove ";
				}
			}
		}
		if ( "possibleEat" in LoM ) {
			for ( let i = 0; i < LoM.possibleEat.length; i++ ) {
				if ( LoM.possibleEat[ i ].col === col && LoM.possibleEat[ i ].row === row ) {
					return className += "possibleEat ";
				}
			}
		}
		if ( "possibleRock" in LoM ) {
			for ( let i = 0; i < LoM.possibleRock.length; i++ ) {
				if ( LoM.possibleRock[ i ].col === col && LoM.possibleRock[ i ].row === row ) {
					return className += "possibleRock ";
				}
			}
		}
		return className;
	}

	render () {

		const nextPlayer = this.state.currentPlayer === "black" ? "white" : "black";
		return (
			<div className="board-bkg">
				<div className={ "Board " + this.state.selectedCoord } >
					{
						this.state.board.map( ( line, row ) => line.map( ( piece, col ) => {
							const className = this.getClassName( this.state, col, row )
							return (
								<Square
									key={ row * row + col * col }
									number={ col + row }
									piece={ piece }
									handleClick={ this.handleClick }
									className={ className }
								/>
							)
						} ) )
					}
					{ this.state.chessMate && (
						<div className="chessMate">{ nextPlayer + " wins" }</div>
					) }
				</div>
			</div>
		)
	}
}

const mapStateToProps = ( state, ownProps ) => ( { ...state, ...ownProps } )

export default connect( mapStateToProps )( Board );

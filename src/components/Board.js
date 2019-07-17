import React from "react";
import Square from "./Square";
import { Knight, EmptySlot, Rook, Bishop, Queen, King, Pawn } from "../pieces/Pieces.js";
import { getPossibleMoves, getRock, getPawnEatingMoves, movePiece, changePawnToQueen, handleRock } from "../helpers/helpers"

const initialBoard = [
	[ new Rook( "white" ), new Knight( "white" ), new Bishop( "white" ), new King( "white" ), new Queen( "white" ), new Bishop( "white" ), new Knight( "white" ), new Rook( "white" ) ],
	[ new Pawn( "white" ), new EmptySlot( "white" ), new Pawn( "white" ), new EmptySlot( "white" ), new EmptySlot( "white" ), new Pawn( "white" ), new EmptySlot( "white" ), new Pawn( "white" ) ],
	[ new EmptySlot(), new EmptySlot(), new EmptySlot(), new EmptySlot(), new EmptySlot(), new EmptySlot(), new EmptySlot(), new EmptySlot() ],
	[ new EmptySlot(), new EmptySlot(), new EmptySlot(), new EmptySlot(), new EmptySlot(), new EmptySlot(), new EmptySlot(), new EmptySlot() ],
	[ new EmptySlot(), new EmptySlot(), new EmptySlot(), new EmptySlot(), new EmptySlot(), new EmptySlot(), new EmptySlot(), new EmptySlot() ],
	[ new EmptySlot(), new EmptySlot(), new EmptySlot(), new EmptySlot(), new EmptySlot(), new EmptySlot(), new EmptySlot(), new EmptySlot() ],
	[ new Pawn( "black" ), new Pawn( "black" ), new EmptySlot( "black" ), new Pawn( "black" ), new EmptySlot( "black" ), new EmptySlot( "black" ), new EmptySlot( "black" ), new Pawn( "black" ) ],
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
		LoM: { possibleMoves: [], possibleEat: [], possibleRock: [] },
		lostPieces: {
			white: [],
			black: []
		}
	}

	handleClick = ( piece, e ) => {
		const { board, currentPlayer, selectedCoord, lostPieces } = this.state;
		const hasSelectedPieceToMove = piece.color === currentPlayer && ( piece.coord.col !== selectedCoord.col || piece.coord.row !== selectedCoord.row )
		const validMove = ( piece.coord.col !== selectedCoord.col || piece.coord.row !== selectedCoord.row ) && ( piece.color === currentPlayer || e.target.classList.contains( "possibleMove" ) || e.target.classList.contains( "possibleEat" ) || e.target.classList.contains( "possibleRock" ) );

		if ( hasSelectedPieceToMove ) {

			let LoM = getPossibleMoves( { ...this.state }, piece )

			if ( piece.name === "King" && piece.firstMove ) {
				LoM = { ...LoM, ...getRock( { ...this.state }, piece ) }
			}

			if ( piece.name === "Pawn" ) {
				LoM = { ...LoM, ...getPawnEatingMoves( { ...this.state }, piece ) }
			}

			this.setState( { LoM, selectedCoord: piece.coord } )
			return
		}

		else if ( !validMove ) {
			console.log( "invalid move" )
			this.setState( {
				selectedCoord: {},
				LoM: { possibleMoves: [], possibleEat: [], possibleRock: [] }
			} )
		}

		else if ( validMove ) {
			const nextPlayer = currentPlayer === "black" ? "white" : "black";
			const playedPiece = board[ selectedCoord.row ][ selectedCoord.col ]
			const { col, row } = piece.coord;
			const ateFromBehind = this.state.firstMoveWeakness && playedPiece.name === "Pawn" && col === this.state.firstMoveWeakness.col && row === this.state.firstMoveWeakness.row;
			const ateSomething = board[ piece.coord.row ][ piece.coord.col ].name;
			const direction = playedPiece.direction;
			const pawnDoubleMove = playedPiece.name === "Pawn" && ( row === 3 || row === 4 );
			const didRock = e.target.classList.contains( "possibleRock" );
			let firstMoveWeakness = null;

			if ( ateSomething ) {
				lostPieces[ nextPlayer ] = [ ...lostPieces[ nextPlayer ], { ...board[ row ][ col ] } ]
			}

			movePiece( board, selectedCoord, piece.coord );

			if ( didRock ) {
				handleRock( this.state.board, piece.coord )
			}

			if ( ateFromBehind ) {
				lostPieces[ nextPlayer ] = [ ...lostPieces[ nextPlayer ], { ...board[ row - direction ][ col ] } ]
				board[ row - direction ][ col ] = Object.assign( {}, new EmptySlot(), { coord: { row: row - direction, col } } )

			}

			if ( playedPiece.firstMove ) {
				board[ piece.coord.row ][ piece.coord.col ].handleFirstMove()

				if ( pawnDoubleMove ) {
					board[ row - direction ][ col ] = Object.assign( board[ row - direction ][ col ], { firstMoveWeakness: true } )
					firstMoveWeakness = { col, row: row - direction }
				}
			}
			else if ( board[ piece.coord.row ][ piece.coord.col ].name === "Pawn" && ( piece.coord.row === 0 || piece.coord.row === 7 ) )
				changePawnToQueen( board, piece.coord, currentPlayer )

			this.setState( {
				selectedCoord: {},
				LoM: { possibleMoves: [], possibleEat: [], possibleRock: [] },
				currentPlayer: nextPlayer,
				firstMoveWeakness
			} )
		}
	}

	getClassName = ( col, row ) => {
		const { selectedCoord, LoM } = this.state;
		let className = " ";
		if ( this.state.board[ row ][ col ].color ) {
			className += ( this.state.board[ row ][ col ].color + "Piece " )
		}
		if ( selectedCoord.col === col && selectedCoord.row === row )
			className += "isSelected ";
		if ( LoM.possibleMoves ) LoM.possibleMoves.forEach( possibleMove => {
			if ( possibleMove.col === col && possibleMove.row === row ) {
				className += "possibleMove ";
			}
		} )
		if ( LoM.possibleEat ) LoM.possibleEat.forEach( possibleEat => {
			if ( possibleEat.col === col && possibleEat.row === row ) {
				className += "possibleEat ";
			}
		} )
		if ( LoM.possibleRock ) LoM.possibleRock.forEach( possibleRock => {
			if ( possibleRock.col === col && possibleRock.row === row ) {
				className += "possibleRock ";
			}
		} )
		return className;
	}

	render () {
		return (
			<div className={ "Board " + this.state.selectedCoord } >
				{
					this.state.board.map( ( line, row ) => line.map( ( piece, col ) => {
						const className = this.getClassName( col, row )
						return (
							<Square
								key={ row * row + col * col }
								pieceType={ `${ piece.color }${ piece.name }` }
								number={ col + row }
								piece={ piece }
								handleClick={ this.handleClick }
								className={ className }
							/>
						)
					} ) )
				}
			</div>
		)
	}
}

export default Board;
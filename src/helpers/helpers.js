import { EmptySlot, Queen, Rook } from "../pieces/Pieces"
import blackKing from "./../img/blackKing.png";
import blackKnight from "./../img/blackKnight.png";
import blackPawn from "./../img/blackPawn.png";
import blackQueen from "./../img/blackQueen.png";
import blackRook from "./../img/blackRook.png";
import blackBishop from "./../img/blackBishop.png";
import whiteBishop from "./../img/whiteBishop.png";
import whiteKing from "./../img/whiteKing.png";
import whiteKnight from "./../img/whiteKnight.png";
import whitePawn from "./../img/whitePawn.png";
import whiteQueen from "./../img/whiteQueen.png";
import whiteRook from "./../img/whiteRook.png";


export function getPossibleMoves ( board, currentPlayer, piece, checkValidity = true ) {

	return piece.movement.reduce( ( LoM, direction ) => {
		let i = 0;

		while ( i < direction.length ) {
			const { x, y } = direction[ i ];
			const { col, row } = piece.coord;
			const isWithinBoard = col + x <= 7 && col + x >= 0 && row + y >= 0 && row + y <= 7;
			let boardCopy = board.map( line => [ ...line ] );

			if ( isWithinBoard ) {
				const hyptheticalMove = board[ row + y ][ col + x ];
				const isEmptySlot = !hyptheticalMove.name;
				const isTeamMate = hyptheticalMove.color === currentPlayer
				const isEnemy = hyptheticalMove.color && hyptheticalMove.color !== currentPlayer;

				if ( isEmptySlot ) {
					if ( checkValidity ) { //avoids infinite CB // check the validity of the move only when analysing own move (defaults true) // is false when checking if the analysed own move gets the player self chessed
						const isAllowed = checkifAllowed( boardCopy, currentPlayer, piece.coord, { col: col + x, row: row + y } );
						isAllowed
							? LoM.possibleMoves.push( { col: col + x, row: row + y } )
							: LoM.forbiddenMoves.push( { col: col + x, row: row + y } )
					}
				}
				if ( !isEmptySlot && piece.name === "Pawn" ) {
					break
				}
				else if ( isTeamMate ) {
					break;
				}
				else if ( isEnemy ) {
					if ( hyptheticalMove.name === "King" ) {
						LoM.possibleChess = true; // used in the "checkifAllowed" method : if true the move is not allowed
					}
					if ( checkValidity ) { //avoids infinite CB // check the validity of the move only when analysing own move (defaults true) // is false when checking if the analysed own move gets the player self chessed
						const isAllowed = checkifAllowed( boardCopy, currentPlayer, piece.coord, { col: col + x, row: row + y } );
						isAllowed
							? LoM.possibleMoves.push( { col: col + x, row: row + y } )
							: LoM.forbiddenMoves.push( { col: col + x, row: row + y } )
					}
					LoM.possibleEat.push( { col: col + x, row: row + y } )
					break;
				}

			}
			i++;
		}
		return LoM
	}, { possibleMoves: [], possibleEat: [], forbiddenMoves: [], possibleChess: false } )
}

export function getPawnEatingMoves ( board, currentPlayer, firstMoveWeakness, piece, checkValidity = true ) {
	const { col, row } = piece.coord;
	let boardCopy = board.map( line => [ ...line ] );

	if ( piece.eatingMoves ) return piece.eatingMoves.reduce( ( LoM, { x, y } ) => {
		const isWithinBoard = col + x <= 7 && col + x >= 0 && row + y >= 0 && row + y <= 7;

		if ( isWithinBoard ) {
			const hyptheticalMove = board[ row + y ][ col + x ];
			const isEnemy = hyptheticalMove.color && hyptheticalMove.color !== currentPlayer;
			if ( isEnemy ) {
				if ( hyptheticalMove.name === "King" ) {
					LoM.possibleChess = true;
				}
				if ( checkValidity ) { //check the validity of the move only when analysing own move (defaults true) // is false when checking if the analysed own move gets the player self chessed
					const isAllowed = checkifAllowed( boardCopy, currentPlayer, piece.coord, { col: col + x, row: row + y } );
					isAllowed ? LoM.possibleEat.push( { col: col + x, row: row + y } ) : LoM.forbiddenMoves.push( { col: col + x, row: row + y } )
				}
			}
			if ( firstMoveWeakness ) {
				if ( firstMoveWeakness.col === col + x && firstMoveWeakness.row === row + y ) {
					LoM.possibleEat.push( { col: col + x, row: row + y } )
				}
			}
		}
		return LoM;
	}, { possibleEat: [], forbiddenMoves: [], possibleChess: false } )
}

function checkifAllowed ( board, currentPlayer, currentPos, hypotheticPos ) {
	const nextPlayer = currentPlayer === "black" ? "white" : "black";
	let hypotheticBoard = movePiece( board, currentPos, hypotheticPos )

	for ( let i = 0; i < hypotheticBoard.length; i++ ) {
		for ( let j = 0; j < hypotheticBoard[ i ].length; j++ ) {
			const piece = hypotheticBoard[ i ][ j ];

			if ( piece.color !== nextPlayer )
				continue;
			if ( getPossibleMoves( hypotheticBoard, nextPlayer, piece, false ).possibleChess )
				return false
			if ( piece.name === "Pawn"
				&& getPawnEatingMoves( hypotheticBoard, nextPlayer, false, piece, false ).possibleChess )
				return false
		}
	}
	return true;
}

export function getRock ( { board, currentPlayer }, piece ) {
	function getClosest ( direction = 1 ) {
		const { col, row } = piece.coord;
		for ( let i = 1; col + i * direction <= 7 && col + i * direction >= 0; i++ ) {
			const piece = board[ row ][ col + i * direction ];
			if ( piece.color ) {
				return piece
			}
		}
	}
	const canRockLeft = getClosest( -1 ) === undefined ? false : getClosest( -1 ).firstMove;
	const canRockRight = getClosest( 1 ) === undefined ? false : getClosest( 1 ).firstMove;
	let RockList = { possibleRock: [] }

	if ( !canRockLeft && !canRockRight )
		return RockList;
	if ( piece.firstMove && ( canRockLeft || canRockRight ) ) {
		if ( canRockLeft )
			RockList.possibleRock.push( { col: 1, row: piece.coord.row } )
		if ( canRockRight )
			RockList.possibleRock.push( { col: 5, row: piece.coord.row } )
	}
	return RockList;
}

export function handleRock ( board, coord ) {
	if ( coord.col === 1 ) {
		board[ coord.row ][ 2 ] = Object.assign( {}, new Rook( "black" ), { coord: { row: coord.row, col: 2 } } );
		board[ coord.row ][ 0 ] = Object.assign( {}, new EmptySlot(), { coord: { row: coord.row, col: 0 } } )
	}
	if ( coord.col === 5 ) {
		board[ coord.row ][ 4 ] = Object.assign( {}, board[ coord.row ][ 7 ], { coord: { row: coord.row, col: 4 } } )
		board[ coord.row ][ 7 ] = Object.assign( {}, new EmptySlot(), { coord: { row: coord.row, col: 7 } } )
	}
	return board;
}

export function movePiece ( board, Start, End ) {
	const playingPiece = board[ Start.row ][ Start.col ];
	board[ End.row ][ End.col ] = Object.assign( {}, playingPiece, { coord: End } );
	board[ Start.row ][ Start.col ] = Object.assign( new EmptySlot(), { coord: Start } );

	return board;
}

export function changePawnToQueen ( board, coord, currentPlayer ) {
	board[ coord.row ][ coord.col ] = Object.assign( {}, new Queen( currentPlayer ), { coord } )
	return board;
}

export function animatePiece ( startCoord, endCoord, image ) {
	let xDiff = startCoord.x - endCoord.x;
	let yDiff = startCoord.y - endCoord.y;

	image.setAttribute( "style", `transform:translate(${ xDiff }px, ${ yDiff }px)` )
	setTimeout( () => image.setAttribute( "style", `transform:translate(0px, 0px)` ), 1000 )
	let cancelID = window.requestAnimationFrame( animation )

	function animation () {
		const xPerFrame = xDiff / 6;
		const yPerFrame = yDiff / 6;
		xDiff = xDiff - xPerFrame;
		yDiff = yDiff - yPerFrame;
		image.setAttribute( "style", `transform:translate(${ xDiff }px, ${ yDiff }px)` )

		cancelID = window.requestAnimationFrame( animation )
		if ( cancelID % 50 === 0 ) window.cancelAnimationFrame( cancelID )
	}
}

export function getImage ( piece ) {
	const pieceType = `${ piece.color }${ piece.name }`

	return pieceType === "blackKing" ? blackKing
		: pieceType === "blackKnight" ? blackKnight
			: pieceType === "blackPawn" ? blackPawn
				: pieceType === "blackQueen" ? blackQueen
					: pieceType === "blackRook" ? blackRook
						: pieceType === "blackBishop" ? blackBishop
							: pieceType === "whiteBishop" ? whiteBishop
								: pieceType === "whiteKing" ? whiteKing
									: pieceType === "whiteKnight" ? whiteKnight
										: pieceType === "whitePawn" ? whitePawn
											: pieceType === "whiteQueen" ? whiteQueen
												: pieceType === "whiteRook" ? whiteRook
													: "";
}
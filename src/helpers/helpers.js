import { EmptySlot, Queen, Rook } from "../pieces/Pieces"
import blackKing from "../img/blackking.svg";
import blackKnight from "../img/blackknight.svg";
import blackPawn from "../img/blackpawn.svg";
import blackQueen from "../img/blackqueen.svg";
import blackRook from "../img/blackrook.svg";
import blackBishop from "../img/blackbishop.svg";
import whiteBishop from "../img/whitebishop.svg";
import whiteKing from "../img/whiteking.svg";
import whiteKnight from "../img/whiteknight.svg";
import whitePawn from "../img/whitepawn.svg";
import whiteQueen from "../img/whitequeen.svg";
import whiteRook from "../img/whiterook.svg";

/*
 *  TABLE OF CONTENT
 * 
 *  1. HELPERS FOR PIECE SELECTION
 * 		1.1 getPossibleMoves
 * 		1.2 getPawnEatingMoves
 * 		1.3 checkifAllowed
 * 		1.4 getRock
 * 		1.5 verifyChessMate
 * 
 *  2. HELPERS TO HANDLE MOVE
 * 		2.1 handleRock
 * 		2.2 movePiece
 * 		2.3 changePawnToQueen
 * 		2.4 getPossibleMoves
 * 
 *  3. DISPLAY HELPERS
 * 		3.1 animatePiece
 * 		3.2 getImage
 * 		3.3 rotateBkg
 */


/**********************************
 * 1. HELPERS FOR PIECE SELECTION
 **********************************/

//1.1 getPossibleMoves
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

				if ( isEmptySlot ) {//avoids infinite CB // if TRUE (default) : the validity of the possibleMove will be checked// if set FALSE, the possible move validity will not be checked
					if ( checkValidity ) {
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
					if ( checkValidity ) { //avoids infinite CB // if TRUE (default) : the validity of the possibleMove will be checked// if set FALSE, the possible move validity will not be checked
						const isAllowed = checkifAllowed( boardCopy, currentPlayer, piece.coord, { col: col + x, row: row + y } );
						isAllowed
							? LoM.possibleEat.push( { col: col + x, row: row + y } )
							: LoM.forbiddenMoves.push( { col: col + x, row: row + y } )
					}
					break;
				}

			}
			i++;
		}
		return LoM
	}, { possibleMoves: [], possibleEat: [], forbiddenMoves: [], possibleChess: false } )
}

// 1.2 Pawn is the only piece that does not eat from it's normal move, it uses another path that required its own method
export function getPawnEatingMoves ( board, color, firstMoveWeakness, piece, LoM, checkValidity = true ) {
	const { col, row } = piece.coord;
	let boardCopy = board.map( line => [ ...line ] );

	if ( piece.eatingMoves ) return piece.eatingMoves.reduce( ( LoM, { x, y } ) => {
		const isWithinBoard = col + x <= 7 && col + x >= 0 && row + y >= 0 && row + y <= 7;

		if ( isWithinBoard ) {
			const hyptheticalMove = board[ row + y ][ col + x ];
			const isEnemy = hyptheticalMove.color && hyptheticalMove.color !== color;
			if ( isEnemy ) {
				if ( hyptheticalMove.name === "King" ) {
					LoM.possibleChess = true;
				}
				if ( checkValidity ) { //avoids infinite CB // if TRUE (default) : the validity of the possibleMove will be checked// if set FALSE, the possible move validity will not be checked
					const isAllowed = checkifAllowed( boardCopy, color, piece.coord, { col: col + x, row: row + y } );
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
	}, { possibleEat: [], forbiddenMoves: LoM.forbiddenMoves ? [ ...LoM.forbiddenMoves ] : [], possibleChess: false } )
}

// 1.3 check if the move is allowed, if it is not allowed the result will be then used to display a red cross on the Slot
function checkifAllowed ( board, currentPlayer, currentPos, hypotheticPos ) {
	//creates a fake board for each possible move / eat of the selected piece and check if OWN king gets chessed
	//if chess => return false, the slot will become a forbidden move
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

// 1.4 check if a rock can be done
export function getRock ( { board }, piece ) {
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

// 1.5 check if next play has some possible moves. If so => return
export function verifyChessMate ( board, currentPlayer ) {
	const nextPlayer = currentPlayer === "black" ? "white" : "black";

	for ( let i = 0; i < board.length; i++ ) {
		for ( let j = 0; j < board[ i ].length; j++ ) {
			const piece = board[ i ][ j ];

			if ( piece.color === nextPlayer
				&& ( getPossibleMoves( board, nextPlayer, piece ).possibleMoves.length
					|| getPossibleMoves( board, nextPlayer, piece ).possibleEat.length ) ) {
				return false
			}
		}
	}
	return true;
}

/****************************
 * 2. HELPERS TO HANDLE MOVE
 ****************************/

// 2.1 handleRock
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

// 2.2 movePiece
export function movePiece ( board, Start, End ) {
	const playingPiece = board[ Start.row ][ Start.col ];
	board[ End.row ][ End.col ] = Object.assign( {}, playingPiece, { coord: End } );
	board[ Start.row ][ Start.col ] = Object.assign( new EmptySlot(), { coord: Start } );

	return board;
}

// 2.3 changePawnToQueen
export function changePawnToQueen ( board, coord, currentPlayer ) {
	board[ coord.row ][ coord.col ] = Object.assign( {}, new Queen( currentPlayer ), { coord } )
	return board;
}

/***************************
 * 3. DISPLAY HELPERS
 ***************************/

// 3.1 animatePiece
export function animatePiece ( startCoord, endCoord, target ) {
	const root = document.documentElement;

	target.firstChild.classList.toggle( "movingPiece" )
	root.style.setProperty( "--X", `${ startCoord.x - endCoord.x }px` )
	root.style.setProperty( "--Y", `${ startCoord.y - endCoord.y }px` )

	setTimeout( () => {
		target.firstChild.classList.toggle( "movingPiece" )
		root.style.setProperty( "--X", "0" )
		root.style.setProperty( "--Y", "0" )
	}, 500 )
}

// 3.2 getImage
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

// 3.3 rotateBkg
export function rotateBkg ( currentPlayer ) {
	let angle = currentPlayer === "black"
		? 0
		: 180;
	let startingAngle = angle;

	function setAngle () {
		if ( startingAngle - angle < 100 )
			angle = angle - 4
		else if ( startingAngle - angle < 150 )
			angle = angle - 1
		else
			angle = angle - 0.5
		console.log( startingAngle - angle )
		document.documentElement.style.setProperty( "--angle", angle + "deg" )
		if ( angle !== 0 && angle !== -180 )
			window.requestAnimationFrame( setAngle )
	}
	setAngle()
}




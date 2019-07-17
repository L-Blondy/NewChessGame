import { EmptySlot, Queen, Rook } from "../pieces/Pieces"

export function getPossibleMoves ( { board, currentPlayer }, piece ) {

	return piece.movement.reduce( ( LoM, direction ) => {
		let i = 0;

		while ( i < direction.length ) {
			const { x, y } = direction[ i ];
			const { col, row } = piece.coord;
			const isWithinBoard = col + x <= 7 && col + x >= 0 && row + y >= 0 && row + y <= 7;

			if ( isWithinBoard ) {
				const isEmptySlot = !board[ row + y ][ col + x ].name;
				const isTeamMate = board[ row + y ][ col + x ].color === currentPlayer
				const isEnemy = board[ row + y ][ col + x ].color && board[ row + y ][ col + x ].color !== currentPlayer;

				if ( isEmptySlot ) {
					LoM.possibleMoves.push( { col: col + x, row: row + y } )
				}
				if ( !isEmptySlot && piece.name === "Pawn" )
					break
				else if ( isTeamMate ) {
					break;
				}
				else if ( isEnemy ) {
					LoM.possibleEat.push( { col: col + x, row: row + y } )
					break;
				}
			}
			i++;
		}
		return LoM
	}, { possibleMoves: [], possibleEat: [] } )
}

export function getPawnEatingMoves ( { board, currentPlayer, firstMoveWeakness }, piece ) {
	const { col, row } = piece.coord;

	return piece.eatingMoves.reduce( ( LoM, { x, y } ) => {
		const isWithinBoard = col + x <= 7 && col + x >= 0 && row + y >= 0 && row + y <= 7;

		if ( isWithinBoard ) {
			const isEnemy = board[ row + y ][ col + x ].color && board[ row + y ][ col + x ].color !== currentPlayer;
			if ( isEnemy ) {
				LoM.possibleEat.push( { col: col + x, row: row + y } )
			}
			if ( firstMoveWeakness ) {
				if ( firstMoveWeakness.col === col + x && firstMoveWeakness.row === row + y ) {
					LoM.possibleEat.push( { col: col + x, row: row + y } )
				}
			}
		}
		return LoM;
	}, { possibleEat: [] } )
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
		return {};
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
	board[ Start.row ][ Start.col ] = Object.assign( {}, new EmptySlot(), { coord: Start } );

	return board;
}

export function changePawnToQueen ( board, coord, currentPlayer ) {
	board[ coord.row ][ coord.col ] = Object.assign( {}, new Queen( currentPlayer ), { coord } )
	return board;
}

export function animatePiece ( board, startCoord, endCoord, image ) {
	let xDiff = startCoord.x - endCoord.x;
	let yDiff = startCoord.y - endCoord.y;
	const stopCondition = xDiff > 0 ? xDiff <= 0 : xDiff >= 0;
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
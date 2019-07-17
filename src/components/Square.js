import React from "react";
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


function Square ( { number, pieceType, className, piece, handleClick } ) {

	const SquareColor = ( number ) % 2 === 1 ? "Black" : "White";
	const backgroundImg = pieceType === "blackKing" ? blackKing
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
	return (
		<div
			onClick={ handleClick.bind( null, piece ) }
			className={ `${ SquareColor }Square ${ className }` }
		>
			<img src={ backgroundImg } />
		</div >
	)
}

export default React.memo( Square );
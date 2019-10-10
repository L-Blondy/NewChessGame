// Constructors base
function Base ( color ) {
	this.color = color;
	this.possibleMove = false;
	this.selected = false;
}

export function EmptySlot () {
	this.name = null;
	this.possibleMove = false;
	this.selected = false;
}


export function Knight ( color ) {
	Base.call( this, color )
	this.name = "Knight";
	this.src = "knight"
	this.movement = [
		[ { x: 1, y: 2 } ],
		[ { x: -1, y: 2 } ],
		[ { x: 1, y: -2 } ],
		[ { x: -1, y: -2 } ],
		[ { x: 2, y: 1 } ],
		[ { x: -2, y: 1 } ],
		[ { x: 2, y: -1 } ],
		[ { x: -2, y: -1 } ]
	]
}

export function Rook ( color ) {
	Base.call( this, color )
	this.name = "Rook";
	this.src = "rook";
	this.firstMove = true;
	this.movement = function () {
		let UP = Array( 7 ).fill().reduce( ( acc, cur, index ) => ( acc.push( { x: 0, y: - index - 1 } ), acc ), [] )
		let DOWN = Array( 7 ).fill().reduce( ( acc, cur, index ) => ( acc.push( { x: 0, y: index + 1 } ), acc ), [] )
		let LEFT = Array( 7 ).fill().reduce( ( acc, cur, index ) => ( acc.push( { x: - index - 1, y: 0 } ), acc ), [] )
		let RIGHT = Array( 7 ).fill().reduce( ( acc, cur, index ) => ( acc.push( { x: index + 1, y: 0 } ), acc ), [] )

		return [ UP, DOWN, LEFT, RIGHT ];
	}()
	this.handleFirstMove = function () {
		this.firstMove = false;
	}
}

export function Bishop ( color ) {
	Base.call( this, color )
	this.name = "Bishop";
	this.src = "bishop"
	this.movement = function () {
		let UP_LEFT = Array( 7 ).fill().reduce( ( acc, cur, index ) => ( acc.push( { x: - index - 1, y: - index - 1 } ), acc ), [] )
		let DOWN_LEFT = Array( 7 ).fill().reduce( ( acc, cur, index ) => ( acc.push( { x: - index - 1, y: index + 1 } ), acc ), [] )
		let UP_RIGHT = Array( 7 ).fill().reduce( ( acc, cur, index ) => ( acc.push( { x: index + 1, y: - index - 1 } ), acc ), [] )
		let DOWN_RIGHT = Array( 7 ).fill().reduce( ( acc, cur, index ) => ( acc.push( { x: index + 1, y: index + 1 } ), acc ), [] )

		return [ UP_LEFT, DOWN_LEFT, UP_RIGHT, DOWN_RIGHT ];
	}()
}

export function Queen ( color ) {
	Base.call( this, color )
	this.name = "Queen";
	this.src = "crown"
	this.movement = function () {
		let UP = Array( 7 ).fill().reduce( ( acc, cur, index ) => ( acc.push( { x: 0, y: - index - 1 } ), acc ), [] )
		let DOWN = Array( 7 ).fill().reduce( ( acc, cur, index ) => ( acc.push( { x: 0, y: index + 1 } ), acc ), [] )
		let LEFT = Array( 7 ).fill().reduce( ( acc, cur, index ) => ( acc.push( { x: - index - 1, y: 0 } ), acc ), [] )
		let RIGHT = Array( 7 ).fill().reduce( ( acc, cur, index ) => ( acc.push( { x: index + 1, y: 0 } ), acc ), [] )
		let UP_LEFT = Array( 7 ).fill().reduce( ( acc, cur, index ) => ( acc.push( { x: - index - 1, y: - index - 1 } ), acc ), [] )
		let DOWN_LEFT = Array( 7 ).fill().reduce( ( acc, cur, index ) => ( acc.push( { x: - index - 1, y: index + 1 } ), acc ), [] )
		let UP_RIGHT = Array( 7 ).fill().reduce( ( acc, cur, index ) => ( acc.push( { x: index + 1, y: - index - 1 } ), acc ), [] )
		let DOWN_RIGHT = Array( 7 ).fill().reduce( ( acc, cur, index ) => ( acc.push( { x: index + 1, y: index + 1 } ), acc ), [] )

		return [ UP, DOWN, LEFT, RIGHT, UP_LEFT, DOWN_LEFT, UP_RIGHT, DOWN_RIGHT ];
	}()
}

export function King ( color ) {
	Base.call( this, color )
	this.name = "King";
	this.src = "king"
	this.firstMove = true;
	this.movement = [
		[ { x: -1, y: -1 } ],
		[ { x: -1, y: 0 } ],
		[ { x: -1, y: 1 } ],
		[ { x: 0, y: 1 } ],
		[ { x: 1, y: 1 } ],
		[ { x: 1, y: 0 } ],
		[ { x: 1, y: -1 } ],
		[ { x: 0, y: -1 } ]
	]
	this.handleFirstMove = function () {
		this.firstMove = false;
	}
}

export function Pawn ( color ) {
	Base.call( this, color )
	this.name = "Pawn";
	this.src = "pawn"
	this.firstMove = true;
	this.direction = ( color === "white" ? 1 : -1 )
	this.movement = [ [ { x: 0, y: 1 * this.direction }, { x: 0, y: 2 * this.direction } ] ]

	this.getEatFromBehindPosition = function () {
		return - this.direction;
	}
	this.eatingMoves = [ { x: -1, y: this.direction }, { x: 1, y: this.direction } ]
	this.handleFirstMove = function () {
		this.firstMove = false;
		this.movement = [ [ { x: 0, y: this.direction } ] ];
	}
}
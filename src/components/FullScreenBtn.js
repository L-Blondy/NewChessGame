import React from "react";

function FullScreenBtn () {

	const root = document.getElementById( "root" )

	const toggleFullscreen = () => {
		if ( !document.webkitIsFullScreen ) {
			if ( root.requestFullscreen ) {
				root.requestFullscreen();
			} else if ( root.mozRequestFullScreen ) { /* Firefox */
				root.mozRequestFullScreen();
			} else if ( root.webkitRequestFullscreen ) { /* Chrome, Safari and Opera */
				root.webkitRequestFullscreen();
			} else if ( root.msRequestFullscreen ) { /* IE/Edge */
				root.msRequestFullscreen();
			}
		}
		else {
			if ( document.exitFullscreen ) {
				document.exitFullscreen();
			} else if ( document.mozCancelFullScreen ) {
				document.mozCancelFullScreen();
			} else if ( document.webkitExitFullscreen ) {
				document.webkitExitFullscreen();
			} else if ( document.msExitFullscreen ) {
				document.msExitFullscreen();
			}
		}



	}

	const closeFullscreen = () => {
		console.log( root.requestFullscreen )

	}
	return (
		<>
			<button onClick={ toggleFullscreen }>ToggleFullScreen</button>
		</>
	)

}

export default FullScreenBtn;
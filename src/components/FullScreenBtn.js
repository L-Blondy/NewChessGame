import React from "react";

function FullScreenBtn () {

	const [ fullScreen, setScreenState ] = React.useState( false )

	const root = document.getElementById( "root" )

	const toggleFullscreen = () => {
		if ( !document.webkitIsFullScreen ) {
			if ( root.requestFullscreen ) {
				root.requestFullscreen();
			} else if ( root.mozRequestFullScreen ) {
				root.mozRequestFullScreen();
			} else if ( root.webkitRequestFullscreen ) {
				root.webkitRequestFullscreen();
			} else if ( root.msRequestFullscreen ) {
				root.msRequestFullscreen();
			}
			setScreenState( true )
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
			setScreenState( false )
		}
	}
	const icon = fullScreen
		? <i className="fas fa-compress-arrows-alt" onClick={ toggleFullscreen }></i>
		: <i className="fas fa-expand-arrows-alt" onClick={ toggleFullscreen }></i>

	return (
		<>
			{ icon }
		</>
	)

}

export default FullScreenBtn;
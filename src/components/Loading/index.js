import React from "react";
import Loader from "react-loader-spinner";
const Loading = (props) => {
	return(
		<div className="container-loading-page">
			<Loader
		        type="BallTriangle"
		        color="#d51b1b"
			    height={80}
			    width={80}
		        timeout={props.time}
     		/>
		</div>
	)
}
export default Loading;

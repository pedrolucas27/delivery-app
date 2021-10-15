import React from "react";
import image_empty from "../../images/empty_product.jpeg";
import "../../index.css";
const MessageIsEmpty = (props) => {
	return(
		<div className="w-full m-auto">
			<p className="w-full text-center text-black font-bold text-xl">
				{props.title}
			</p>
			<div className="flex justify-center mt-10" >
  <div>
  <img className="rounded-full h-24 w-24" src={image_empty} alt="image"/>
  </div>
</div>
			
		</div>
	);
}
export default MessageIsEmpty;

import React from "react";
import { changeCommaForPoint } from "../../helpers.js";
import pie_default from "../../images/pie.png";
import "../../index.css";
const CardProduct = (props) => {
	return(
    	<div className="flex p-2 shadow cursor-pointer rounded-lg shadow-md" onClick={props.showModal}>
		  	<div className="flex-none">
		    	<img src={props.image || pie_default} alt="img-product" className="w-24 h-24 rounded-lg" />
		  	</div>
		  	<div className="pl-4">
			    <div className="flex flex-wrap items-baseline">
			      	<h1 className="w-full flex-none text-xl font-semibold mb:2">
			        	{props.name}
			      	</h1>
			      	<div className="w-full leading-7">
			        	<p className="w-full text-sm text-black">
		      				{props.description || "Não possui descrição."}
		    			</p>
			      	</div>
			      	<div className="w-full text-md leading-7 font-bold text-green">
			        	R$ {changeCommaForPoint(props.price)}
			      	</div>
			    </div>
		    	
		  	</div>
		</div>
	);
}
export default CardProduct;

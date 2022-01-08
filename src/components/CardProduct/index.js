import React from "react";
import { changeCommaForPoint } from "../../helpers.js";
import empty_default from "../../images/empty_product.jpeg";
import "../../index.css";
const CardProduct = ({ showModal, imageProduct, nameProduct, description, price }) => {

	return(
    	<div className="flex p-2 shadow cursor-pointer rounded-lg shadow-md" onClick={showModal}>
		  	<div className="flex-none">
		    	<img src={imageProduct || empty_default} alt="img-product" className="w-24 h-24 rounded-lg" />
		  	</div>
		  	<div className="pl-4">
			    <div className="flex flex-wrap items-baseline">
			      	<h1 className="w-full flex-none text-xl font-semibold mb:2">
			        	{nameProduct}
			      	</h1>
			      	<div className="w-full leading-7">
			        	<p className="w-full text-sm text-black">
		      				{description || "Não possui descrição."}
		    			</p>
			      	</div>
			      	<div className="w-full text-md leading-7 font-bold text-green">
			        	R$ {changeCommaForPoint(price)}
			      	</div>
			    </div>
		    	
		  	</div>
		</div>
	);
}
export default CardProduct;

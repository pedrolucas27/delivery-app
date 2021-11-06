import React from "react";
import emptyProduct from '../../images/empty_product.jpeg';
import "../../index.css";
const CardCategory = (props) => {
	return(
		<div key={props.key} className="grid shadow-md rounded-lg cursor-pointer" onClick={props.onChangeCategory}>
		  	<div className="relative z-10 col-start-1 row-start-1 px-4 pt-40 pb-3 bg-gradient-to-t from-black">
		    	<p className="text-sm font-medium text-white">Categoria</p>
		    	<h2 className="text-xl font-semibold text-white sm:text-2xl sm:leading-7 md:text-3xl">
		    		{props.name}
		    	</h2>
		  	</div>
		  	<div className="col-start-1 row-start-1 flex">
		    	<div className="w-full grid grid-rows-2 gap-2">
			      	<div className="relative col-span-3 row-span-2">
			        	<img src={props.image || emptyProduct} alt="" className="absolute inset-0 w-full h-full rounded-lg object-cover bg-gray-100" />
			      	</div>
		    	</div>
		  	</div>
		</div>
	);
}
export default CardCategory;
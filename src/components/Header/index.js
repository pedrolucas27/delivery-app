import React from "react";
import "../../index.css";
const Header = (props) => {
	const dateReal = `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`;
	const isOpen = props?.timeWork ? dateReal >= props?.timeWork[0] && dateReal <= props?.timeWork[1] ? true:false:false
	return(
		<header className="bg-white shadow">
		    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
		      <h1 className="text-3xl font-bold text-black">
		      	{props.title}
		      </h1>
		      	{
		      		props?.timeWork && isOpen && (
		      			<span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-green rounded">
		      				ABERTO AGORA
		      			</span>
		      		)
		      	}

		      	{
		      		props?.timeWork && !isOpen && (
		      			<span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red rounded">
		      				FECHADO AGORA
		      			</span>
		      		)	
		      	}
		    </div>
		</header>
	);
}
export default Header;

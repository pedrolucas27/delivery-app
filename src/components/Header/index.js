import React from "react";
import "../../index.css";
const Header = (props) => {
	return(
		<header className="bg-white shadow">
		    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
		      <h1 className="text-3xl font-bold text-black">
		      	{props.title}
		      </h1>
		    </div>
		</header>
	);
}
export default Header;

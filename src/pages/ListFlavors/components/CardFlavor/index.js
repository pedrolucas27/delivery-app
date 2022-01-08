import React from "react";
import "../../../../index.css";
const CardFlavor = (props) => {
	return(
			<div 
        key={props.key} 
        className={props.check ? "flex rounded-lg shadow-md cursor-pointer bg-yellow text-white":"flex rounded-lg shadow-md cursor-pointer"} 
        onClick={props.onChangeFlavor}
      >
        <div className="flex-1 flex flex-col p-4">
          <h1 className="text-xl font-semibold mb:2">
            {props.name}
          </h1>
          <p>
            {props.description || "-"}
          </p>
        </div>
          {
            props.check && (
              <div className="flex justify-center p-2 w-10 h-10 overflow-hidden sm:w-14 sm:h-14">
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx={12} cy={12} r={12} fill="#fff" opacity="1" />
                  <path
                    d="M7 13l3 3 7-7"
                    stroke="#f4a405"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )
          }
      </div>    
	);
}
export default CardFlavor;

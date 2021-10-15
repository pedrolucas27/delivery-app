import React, { useState } from "react";
import { changeCommaForPoint } from "../../helpers.js";
import "../../index.css";
const ModalAddCart = (props) => {
	const [quantity, setQuantity] = useState(1);

	const cancelAddCart = () => {
		setQuantity(1);
		props.closeModal();
	}
	return(
		<div className={
			props.show ? 
				"overflow-y-visible overflow-x-hidden fixed w-full h-full top-0 left-0 flex items-center justify-center"
			:
				"modal opacity-0 pointer-events-none fixed w-full h-full top-0 left-0 flex items-center justify-center"
		}>
    		<div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
    
		    <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
		      
		      <div className="modal-close absolute top-0 right-0 cursor-pointer flex flex-col items-center mt-4 mr-4 text-white text-sm z-50">
		        <svg className="fill-current text-white" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
		          <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
		        </svg>
		        <span className="text-sm">(Esc)</span>
		      </div>

		      <div className="modal-content py-4 px-6 rounded-lg">

		        <div className="flex justify-between items-center pb-3">
		          <p className="text-lg font-semibold mb:2 ">Adicionar no carrinho</p>
		          <div className="modal-close cursor-pointer z-50">
		            <svg className="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
		              <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
		            </svg>
		          </div>
		        </div>

		        <div className="grid grid-cols-1">
				  	<div className="w-full mt-5">
				  		<p className="w-full text-2xl font-bold">
			        		{props?.product?.name}
			      		</p>
			      		<p className="w-full text-md text-black">
		      				{props?.product?.description || "Não possui descrição."}
		    			</p>
				  	</div>

				  	<div className="grid grid-cols-2 mt-10 mb-10">
				  		<div>
				  			<p className="text-green text-2xl font-bold text-center">
				  				R$ {changeCommaForPoint((quantity) * (props?.product?.price))}
				  			</p>
				  		</div>
  						<div>

  							<div className="flex justify-center">
  								<div>
	  								<button 
	  									className=
	  									{
	  										quantity === 1 ? 
		  									"opacity-50 cursor-not-allowed text-white bg-red rounded-full h-8 w-8 flex items-center justify-center"
		  									:
		  									"text-white bg-red rounded-full h-8 w-8 flex items-center justify-center"
	  									}
	  									onClick={() => setQuantity(quantity - 1)}
	  								>
	  									<span>
	  										<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
	  											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
											</svg>
	  									</span>
	  								</button>
  								</div>
  								<div>
  									<input className="mx-2 border text-center w-10" type="text" value={quantity}/>
  								</div>
  								<div>
  									<button className="text-white bg-green rounded-full h-8 w-8 flex items-center justify-center" onClick={() => setQuantity(quantity + 1)}>
						    			<span>
						    				<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
	  											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
											</svg>
						    			</span>
					    			</button>
  								</div>
  							</div>
  						</div>


				  	</div>
				</div>
		        <div className="flex justify-end pt-2">
		          	<button className="mr-2 bg-red p-2 rounded-lg text-white" onClick={() => cancelAddCart()}>Cancelar</button>
			        <button className="bg-green p-2 rounded-lg text-white" onClick={() => props.addCartProduct(quantity)}>Adicionar e seguir</button>
		        </div>
		      </div>
		    </div>
  		</div>
	);
}
export default ModalAddCart;

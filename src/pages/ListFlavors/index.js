import React, { useState,  useEffect } from "react";
import { useParams } from 'react-router-dom';
import API from "../../server/api.js"
import Navbar from "../../components/Navbar";
import Header from "../../components/Header";
import CardFlavor from "../../components/CardFlavor";
import ShoppingCartMobile from "../../components/ShoppingCart";
import Loading from "../../components/Loading";
import "../../index.css";

const ListFlavors = () => {
	localStorage.removeItem("@masterpizza-delivery-app/key-flavor");
	const ID_COMPANY = "4051e598-c3cf-4252-b38d-cb4df34fbbe2";
	const { idCategory } = useParams();
	const [dataFlavor, setDataFlavor] = useState([]);
	const [openCart, setOpenCart] = useState(false);
	const [loadingFlag, setLoadingFlag] = useState(false);

	useEffect(() => {
		API.get("flavor/byCategory/"+idCategory+"/"+ID_COMPANY).then((response) => {
			let array = [];
			response.data.forEach((flavor) => {
				array.push({
					id: flavor.id,
					name: flavor.name_flavor,
					description: flavor.description,
					check: false
				})
			})
			setDataFlavor(array);
			setLoadingFlag(true);
			setTimeout(function(){ setLoadingFlag(false); }, 5000);						
		}).catch((error) => {
			console.log("MENSAGEM DE ERROR.");
		});
	}, []);

	const checkFlavor = (id) => {
	    let obj = dataFlavor.filter((i) => i.id === id)[0];
	    let newObj = { 
	    	id: id,
	    	name: obj.name, 
	    	description: obj.description,
	    	check: !obj.check
	    }

	    let categoryByFlavor = localStorage.getItem("@masterpizza-delivery-app/key-category");
	    if((categoryByFlavor === "PIZZA") || (categoryByFlavor === "PIZZAS")){
	    	let is_check = !obj.check;
    		if(is_check && (dataFlavor.filter((i) => i.check === true).length === 2)){
      			console.log("Mensagem: Só se pode escolher dois sabores");
    		}else{
      			let array = [];
			    dataFlavor.forEach((p) => { 
			    	if(p.id === id) {
			        	array.push(newObj);
			        } else {
			          	array.push(p);
			     	}
			    })
      			setDataFlavor(array);
    		}
	    }else{
	    	let array = [];
			dataFlavor.forEach((p) => { 
		    	if(p.id === id) {
			        array.push(newObj);
			    } else {
			        array.push({
			        	id: p.id,
				    	name: p.name, 
				    	description: p.description,
				    	check: false
			        });
			    }
			})
      		setDataFlavor(array);
	    }
  	}

  	const redirect = () => {
  		let flavors = dataFlavor.filter((i) => i.check === true);
  		let array = [];
  		flavors.forEach((f) => { array.push(f.id) });
  		localStorage.setItem("@masterpizza-delivery-app/key-flavor", array);
  		window.location.href = "/products-by-filter";
  	}

	return(
		<div>
			{
				!loadingFlag ? (
					<div>
						<Navbar />
						<Header title={'Cardápio'} listFlavors={true} />
						<main>
						    <div className="max-w-7xl mx-auto py-0 sm:px-6 lg:px-8">
						      	<div className="px-4 py-4 sm:px-0 py-6">
						        	<div className="rounded-lg h-96">
							        	<h2 className="pb-4 text-lg w-full font-bold text-black sm:text-2xl">
				                			Escolha até 2 sabores
				              			</h2>
				              			<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
											{
												dataFlavor.map((flavor) => {
													return(
														<CardFlavor
															key={flavor.id}
															name={flavor.name}
															description={flavor.description}
															check={flavor.check}
															onChangeFlavor={() => checkFlavor(flavor.id)}
														/>
													)
												})
											}	
										</div>
							            <div className="mt-4">
							               	<button onClick={redirect} className='bg-green w-full text-white p-2 rounded-lg text-lg font-medium sm:p-3 w-14'>
							              		Seguir
							                </button>   	
							            </div>
						        	</div>
						      	</div>
						    </div>
						</main>
						<ShoppingCartMobile 
							open={openCart}
							close={() => setOpenCart(false)} 
						/>
					</div>
				):(
					<Loading time={5000}/>
				)	
			}
		</div>
	);
}
export default ListFlavors;

import React, { useState, useEffect } from "react";
import API from "../../server/api.js"
import Navbar from "../../components/Navbar";
import Header from "../../components/Header";
import CardProduct from "../../components/CardProduct";
import ShoppingCartMobile from "../../components/ShoppingCart";
import Loading from "../../components/Loading";
import "../../index.css";

const ListProducts = () => {
	const ID_COMPANY = "4051e598-c3cf-4252-b38d-cb4df34fbbe2";
	const idCategory = localStorage.getItem("@masterpizza-delivery-app/id-category");
	const [openCart, setOpenCart] = useState(false);
	const [loadingFlag, setLoadingFlag] = useState(false);
	const [products, setProducts] = useState([]);

	useEffect(() => {
		let length_array = localStorage.getItem("@masterpizza-delivery-app/key-flavor").split(",").length;
		setLoadingFlag(true);
		if(length_array > 1){
			getProductsByMisto();
		}else{
			getProductsByCategoryAndFlavor();
		}
		setTimeout(function(){ setLoadingFlag(false); }, 5000);
	}, []);


	const getProductsByCategoryAndFlavor = async () => {
		const idFlavor = localStorage.getItem("@masterpizza-delivery-app/key-flavor");
		API.get("product/others/" + idCategory + "/" + idFlavor + "/" + ID_COMPANY).then((response) => {
			let array = [];
			response.data.forEach((product) => {
				array.push({
					id: product.id_product,
					name: product.name_product,
					description: product.description,
					image: product.image ? `http://10.0.0.24:8080/${product.image}`:null,
					price: product.price,
					size: product.size_product + " (" + product.unit + " - " + product.abreviation + ")"
				})
			})
				setProducts(array);
		}).catch((error) => {
				console.log("MENSAGEM DE ERROR.");
		});
	}

	const getProductsByMisto = async () => {	
		let array = [];
		let flavors = localStorage.getItem("@masterpizza-delivery-app/key-flavor").split(",");
		API.get("product/others/" + idCategory + "/" + ID_COMPANY).then((response) => {
			response.data.forEach((product) => {
				if ((product.fk_id_flavor === flavors[0]) || (product.fk_id_flavor === flavors[1])) {
					array.push(product);
				}
			})
			filterProductsMistoPerSize(array);
		}).catch((error) => {
			console.log("MENSAGEM DE ERROR.");
		});	
	}

	const filterProductsMistoPerSize = (products) => {
		let sizesSimilar = [];
		let productsMisto = [];
		let flavors = localStorage.getItem("@masterpizza-delivery-app/key-flavor").split(",");
		const productsFlavorOne = products.filter((item) => item.fk_id_flavor === flavors[0]);
		const productsFlavorTwo = products.filter((item) => item.fk_id_flavor === flavors[1]);

		for (let i = 0; i < productsFlavorOne.length; i++) {
			for (let j = 0; j < productsFlavorTwo.length; j++) {
				if (productsFlavorOne[i].fk_id_unit === productsFlavorTwo[j].fk_id_unit) {
					sizesSimilar.push(productsFlavorOne[i].fk_id_unit);
					productsMisto.push({
						id: productsFlavorOne[i].id_product,
						id_2: productsFlavorTwo[j].id_product,
						name: "Pizza: 1/2 " + productsFlavorOne[i].name_flavor + " + 1/2 " + productsFlavorTwo[j].name_flavor,
						description: "Produto misto.",
						price: productsFlavorOne[i].price + productsFlavorTwo[j].price,
						size: productsFlavorOne[i].size_product + " (" + productsFlavorOne[i].unit + " - " + productsFlavorOne[i].abreviation + ")"
					});
				}
			}
		}
		setProducts(productsMisto);
	}

	return(
		<div>
			{
				!loadingFlag ? (
						<div>
							<Navbar clickCartMobile={() => setOpenCart(!openCart)} />
							<Header title={'Cardápio'} listProducts={true} />
							<main>
						    	<div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
						      		<div className="px-4 py-6 sm:px-0">
						        		<div className="rounded-lg h-96">
											<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
												{
													products.map((product) => {
														return(
															<CardProduct
																key={product.id}
																name={product.name}
																image={product.image}
																price={product.price}
																description={product.description}
															/>
														)
													})
												}	
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
export default ListProducts;

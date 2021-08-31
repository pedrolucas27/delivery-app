import React, { useState,  useEffect } from "react";
import API from "../../server/api.js"
import Navbar from "../../components/Navbar";
import Header from "../../components/Header";
import CardCategory from "../../components/CardCategory";
import ShoppingCartMobile from "../../components/ShoppingCart";
import Loading from "../../components/Loading";
import "../../index.css";

const Menu = () => {
	const ID_COMPANY = "4051e598-c3cf-4252-b38d-cb4df34fbbe2";
	const [openCart, setOpenCart] = useState(false);
	const [dataCategory, setDataCategory] = useState([]);
	const [loadingFlag, setLoadingFlag] = useState(false);

	useEffect(() => {
			API.get("category/actives/"+ID_COMPANY).then((response) => {
				let array = [];
				response.data.forEach((category) => {
					array.push({
						id: category.id_category,
						name: category.name_category,
						image: category.image ? `http://10.0.0.24:8080/${category.image}`:null
					})
				})
				setDataCategory(array);	
				setLoadingFlag(true);
				setTimeout(function(){ setLoadingFlag(false); }, 5000);
			}).catch((error) => {
				console.log("MENSAGEM DE ERROR!");
			});
	}, []);

	const redirect = (idCategory, name) => {
		localStorage.setItem("@masterpizza-delivery-app/key-category", name.toUpperCase());
		localStorage.setItem("@masterpizza-delivery-app/id-category", idCategory);
		window.location.href = "/flavors-by-category/"+idCategory;
	}
	
	return(
		<div>
			{
				loadingFlag ? (
					<Loading time={5000}/>
				):(
					<div>
						<Navbar clickCartMobile={() => setOpenCart(!openCart)} />
						<Header title={'Cardápio'}/>
						<main>
						    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
						      	<div className="px-4 py-6 sm:px-0">
						        	<div className="rounded-lg h-96">
										<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
											{
							        			dataCategory.map((item) => (
							        				<CardCategory
							        					key={item.id}
							        					image={item.image}
							        					name={item.name}
							        					onChangeCategory={() => redirect(item.id, item.name)}
							        				/>
							        			))
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
				)
			}
		</div>
	);
}
export default Menu;

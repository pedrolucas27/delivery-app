import React, { useState, useEffect } from "react";
import { useAlert } from 'react-alert';
import API from "../../server/api.js";
import { isLoggedIn } from "../../server/auth.js";
import { getIdCompany } from "../../helpers.js";
import Navbar from "../../components/Navbar";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CardCategory from "./components/CardCategory";
import ShoppingCartMobile from "../../components/ShoppingCart";
import Loading from "../../components/Loading";
import MessageIsEmpty from "../../components/MessageIsEmpty";
import "../../index.css";

const Menu = () => {
	const ID_COMPANY = getIdCompany();
	const [openCart, setOpenCart] = useState(false);
	const [dataCategory, setDataCategory] = useState([]);
	const [loadingFlag, setLoadingFlag] = useState(false);
	const [logged, setLogged] = useState(false);
	const alert = useAlert();

	useEffect(() => {
		setLoadingFlag(true);
		isLoggedIn().then((response) => {
			setLogged(response);
		}).catch((error) => {
			setLogged(false);
		});
		API.get("category/actives/" + ID_COMPANY).then((response) => {
			let array = [];
			response.data.forEach((category) => {
				const nc = String(category.name_category).toLowerCase();

				if (nc !== 'borda' && nc !== 'bordas'){
					array.push({
						id: category.id_category,
						name: category.name_category,
						image: category.image ? `https://api-master-pizza.herokuapp.com/${category.image}` : null
					})
				}
				
			})
			setDataCategory(array);
			setLoadingFlag(false);
		}).catch((error) => {
			setLoadingFlag(false);
			alert.error('Erro ao tentar listar categorias!');
		});
	}, []);

	const redirect = (idCategory, name) => {
		localStorage.setItem("@masterpizza-delivery-app/key-category", name.toUpperCase());
		localStorage.setItem("@masterpizza-delivery-app/id-category", idCategory);
		window.location.href = "/flavors-by-category/" + idCategory;
	}

	return (
		<div>
			{
				loadingFlag ? (
					<Loading time={5000} />
				) : (
					<div>
						<Navbar current={"menu"} clickCartMobile={() => setOpenCart(!openCart)} />
						<Header title={'Cardápio'} />
						<main>
							<div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 h-screen">
								<div className="px-4 py-6 sm:px-0">
									<div className="rounded-lg">
										{
											dataCategory.length !== 0 ? (
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
											) : (
												<MessageIsEmpty
													title="Não existe categoria ativa!"
												/>
											)
										}
									</div>
								</div>
							</div>
						</main>
						<ShoppingCartMobile
							open={openCart}
							close={() => setOpenCart(false)}
							onLoading={(flag) => setLoadingFlag(flag)}
							idClient={logged ? localStorage.getItem('@masterpizza-delivery-app/id_client') : null}
							idCompany={logged ? ID_COMPANY : null}
							logged={logged}
						/>
						<Footer />
					</div>
				)
			}
		</div>
	);
}
export default Menu;
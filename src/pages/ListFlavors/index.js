import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { useAlert } from 'react-alert';
import API from "../../server/api.js";
import { isLoggedIn } from "../../server/auth.js";
import { getIdCompany } from "../../helpers.js";
import Navbar from "../../components/Navbar";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CardFlavor from "./components/CardFlavor";
import ShoppingCartMobile from "../../components/ShoppingCart";
import Loading from "../../components/Loading";
import MessageIsEmpty from "../../components/MessageIsEmpty";
import "../../index.css";

const ListFlavors = () => {
	localStorage.removeItem("@masterpizza-delivery-app/key-flavor");
	const ID_COMPANY = getIdCompany();
	const { idCategory } = useParams();
	const [dataFlavor, setDataFlavor] = useState([]);
	const [openCart, setOpenCart] = useState(false);
	const [loadingFlag, setLoadingFlag] = useState(false);
	const [logged, setLogged] = useState(false);
	const alert = useAlert();
	const categoryByFlavor = localStorage.getItem("@masterpizza-delivery-app/key-category");

	useEffect(() => {
		setLoadingFlag(true);
		isLoggedIn().then((response) => {
			setLogged(response);
		}).catch((error) => {
			setLogged(false);
		});
		API.get("flavor/byCategory/" + idCategory + "/" + ID_COMPANY).then((response) => {
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
			setLoadingFlag(false);
		}).catch((error) => {
			setLoadingFlag(false);
			alert.error('Erro ao tentar listar sabores!');
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
		if ((categoryByFlavor === "PIZZA") || (categoryByFlavor === "PIZZAS")) {
			let is_check = !obj.check;
			if (is_check && (dataFlavor.filter((i) => i.check === true).length === 2)) {
				alert.error('Só se pode escolher no máximo dois sabores!');
			} else {
				let array = [];
				dataFlavor.forEach((p) => {
					if (p.id === id) {
						array.push(newObj);
					} else {
						array.push(p);
					}
				})
				setDataFlavor(array);
			}
		} else {
			let array = [];
			dataFlavor.forEach((p) => {
				if (p.id === id) {
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

	const redirect = (flag) => {
		if (flag) {
			let flavors = dataFlavor.filter((i) => i.check === true);
			let array = [];
			if (flavors.length !== 0) {
				flavors.forEach((f) => { array.push(f.id) });
				localStorage.setItem("@masterpizza-delivery-app/key-flavor", array);
				window.location.href = "/products-by-filter";
			} else {
				alert.error('Escolha no minimo um sabor!');
			}
		} else {
			window.location.href = "/menu";
		}
	}

	return (
		<div>
			{
				!loadingFlag ? (
					<div>
						<Navbar current={"menu"} clickCartMobile={() => setOpenCart(!openCart)} />
						<Header title={'Cardápio'} listFlavors={true} />
						<main>
							<div className="max-w-7xl mx-auto py-0 sm:px-6 lg:px-8 h-screen">
								<div className="px-4 py-4 sm:px-0 py-6">
									<div className="rounded-lg">
										{
											dataFlavor.length !== 0 ? (
												<div>
													<h2 className="pb-4 text-lg w-full font-bold text-black sm:text-2xl">
														{
															(categoryByFlavor === "PIZZA") || (categoryByFlavor === "PIZZAS") ? 
															"Escolha até 2 sabores":"Escolha 1 sabor"
														}
													</h2>
													<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
														{
															dataFlavor.map((flavor) => {
																return (
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
												</div>
											) : (
												<MessageIsEmpty
													title="Esta categoria não possui sabor ou sabor ativo!"
												/>
											)
										}
										<div className="mt-4">
											<button onClick={dataFlavor.length !== 0 ? () => redirect(true) : () => redirect(false)} className='bg-green w-full text-white p-2 rounded-lg text-lg font-medium sm:p-3 w-14'>
												{dataFlavor.length !== 0 ? "Seguir" : "Voltar"}
											</button>
										</div>
									</div>
								</div>
							</div>
						</main>
						<Footer />
						<ShoppingCartMobile
							open={openCart}
							close={() => setOpenCart(false)}
							onLoading={(flag) => setLoadingFlag(flag)}
							idClient={logged ? localStorage.getItem('@masterpizza-delivery-app/id_client') : null}
							idCompany={logged ? ID_COMPANY : null}
							logged={logged}
						/>
					</div>
				) : (
					<Loading time={5000} />
				)
			}
		</div>
	);
}
export default ListFlavors;

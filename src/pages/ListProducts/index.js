import React, { useState, useEffect } from "react";
import { useAlert } from 'react-alert';
import API from "../../server/api.js"
import { isLoggedIn } from "../../server/auth.js";
import { getIdCompany } from "../../helpers.js";
import Navbar from "../../components/Navbar";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CardProduct from "./components/CardProduct";
import ShoppingCartMobile from "../../components/ShoppingCart";
import Loading from "../../components/Loading";
import ModalAddCart from "./components/ModalAddCart";
import MessageIsEmpty from "../../components/MessageIsEmpty";
import "../../index.css";

const ListProducts = () => {
	const ID_COMPANY = getIdCompany();
	const idCategory = localStorage.getItem("@masterpizza-delivery-app/id-category");
	const categoryByFlavor = localStorage.getItem("@masterpizza-delivery-app/key-category");

	const [openCart, setOpenCart] = useState(false);
	const [loadingFlag, setLoadingFlag] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [products, setProducts] = useState([]);
	const [additionals, setAdditionals] = useState([]);
	const [productCart, setProductCart] = useState("");
	const [logged, setLogged] = useState(false);
	const alert = useAlert();

	useEffect(() => {
		let length_array = localStorage.getItem("@masterpizza-delivery-app/key-flavor")?.split(",").length;
		setLoadingFlag(true);
		verifyAuth();
		if (length_array > 1) {
			getProductsByMisto();
		} else {
			getProductsByCategoryAndFlavor();
		}
		setLoadingFlag(false);
	}, []);


	const verifyAuth = () => {
		isLoggedIn().then((response) => {
			setLogged(response);
		}).catch((error) => {
			setLogged(false);
		});
	}

	const getProductsByCategoryAndFlavor = () => {
		const idFlavor = localStorage.getItem("@masterpizza-delivery-app/key-flavor");
		API.get("product/others/" + idCategory + "/" + idFlavor + "/" + ID_COMPANY).then((response) => {
			let array = [];
			response.data.forEach((product) => {
				array.push({
					id: product.id_product,
					name: product.name_product,
					description: product.description,
					image: product.image ? `https://api-master-pizza.herokuapp.com/${product.image}` : 'null',
					price: product.price,
					size: product.size_product + " (" + product.unit + " - " + product.abreviation + ")",
					is_product_mister: false,
					unit_fk: product.fk_id_unit
				})
			})
			setProducts(array);
		}).catch((error) => {
			alert.error('Erro ao tentar listar produtos!');
		});
	}

	const getProductsByMisto = () => {
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
			alert.error('Erro ao tentar listar produtos!');
		});
	}

	const getAdditionalsByCategory = () => {
		try {
			API.get("additional/" + idCategory + "/" + ID_COMPANY).then((response) => {
				let array = [];
				response.data.forEach((additional) => {
					array.push({
						id: additional.id,
						name: additional.name,
						price: additional.price,
						isBorder: false
					})
				})
				setAdditionals(array);
			}).catch((error) => {
				console.log("Erro de comunicação com o servidor! Tente novamente.");
			});
		} catch (error) {
			console.log("Erro na listagem de adicionais pertencete ao produto.");
		}
	}

	const getBorders = async (idUnit) => {
		try{
			const result = await API.get('product/unit-mensuration/'+idUnit);
			let array = [];
			result.data.forEach((border) => {
				const nc = String(border.name_category).toLowerCase();

				if (nc === 'borda' || nc === 'bordas'){
					array.push({
						id: border.id_product,
						name: border.name_product,
						price: border.price,
						isBorder: true
					})
				}
				
			})
			setAdditionals(array);
		}catch(error){
			console.log("Erro na listagem de bordas pertencete ao produto.");
		}
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
						price: Math.max(productsFlavorOne[i].price, productsFlavorTwo[j].price),
						size: productsFlavorOne[i].size_product + " (" + productsFlavorOne[i].unit + " - " + productsFlavorOne[i].abreviation + ")",
						is_product_mister: true,
						unit_fk: productsFlavorOne.fk_id_unit
					});
				}
			}
		}
		setProducts(productsMisto);
	}

	const setFieldsAdditional = (unit) => {
		if ((categoryByFlavor === "PIZZA") || (categoryByFlavor === "PIZZAS")){
			getBorders(unit);
		}else{
			getAdditionalsByCategory();
		}
	}

	const changeProduct = (idProduct, idProduct2) => {
		
		setLoadingFlag(true);
		let product = {};
		if (idProduct2) {
			product = products.filter((item) => item.id === idProduct && item.id_2 === idProduct2)[0];
		} else {
			product = products.filter((item) => item.id === idProduct)[0];
		}
		setFieldsAdditional(product.unit_fk)
		setProductCart(product);

		setTimeout(() => {
			setLoadingFlag(false);
			setShowModal(true);
		}, 1000);
	}

	const addCartProduct = async (quantity, additional) => {
		if (!additional.isBorder) {
			let additional_cart = {
				id_product_fk: null,
				id_product_fk2: null,
				quantity_item: quantity,
				price_item_order: quantity * additional.price,
				observation: null,
				id_additional_fk: additional.id
			}
			await insertAdditionalInCart(additional_cart);
		}else{
			let product_border = {
				id_product_fk: additional.id,
				id_product_fk2: null,
				quantity_item: 1,
				price_item_order: additional.price,
				observation: null,
				id_additional_fk: null
			}
			await insertProductInCart(product_border);
		}

		let product_cart = {
			id_product_fk: productCart.id,
			id_product_fk2: productCart.is_product_mister ? productCart.id_2 : null,
			quantity_item: quantity,
			price_item_order: quantity * productCart.price,
			observation: productCart.is_product_mister ? productCart.name : null,
			id_additional_fk: null
		}
		await insertProductInCart(product_cart);
	}

	const insertAdditionalInCart = async (additional) => {
		verifyAuth();
		try {
			if (logged) {
				const idClient = localStorage.getItem('@masterpizza-delivery-app/id_client');
				const responseAdditionalCart = await API.post("cart_product",
					{
						product: additional,
						id_client_fk: idClient,
						is_pdv: false,
						id_company: ID_COMPANY
					}
				);
				if (responseAdditionalCart.status !== 200) {
					alert.error('Error ao tentar inserir adicional no carrinho! Tente novamente.');
				}
			} else {
				alert.error('Faça o login antes de adicionar produto no carrinho!');
				setTimeout(() => {
					window.location.href = "/login";
				}, 1000);
			}
		} catch (error) {
			alert.error('Erro ao tentar inserir adicional no carrinho.');
		}
	}

	const insertProductInCart = async (product) => {
		verifyAuth();
		setLoadingFlag(true);
		try {
			if (logged) {
				const idClient = localStorage.getItem('@masterpizza-delivery-app/id_client');
				const responseProductCart = await API.post("cart_product",
					{
						product: product,
						id_client_fk: idClient,
						is_pdv: false,
						id_company: ID_COMPANY
					}
				);
				setLoadingFlag(false);
				if (responseProductCart.status === 200) {
					alert.success('Adicionado no carrinho! Siga em frente.');
					setShowModal(false);
					window.location.href = "/menu";
				} else {
					alert.error('Error ao tentar adicionar no carrinho! Tente novamente.');
					setShowModal(false);
				}
			} else {
				setLoadingFlag(false);
				alert.error('Faça o login antes de adicionar produto no carrinho!');
				setTimeout(() => {
					window.location.href = "/login";
				}, 1000);
			}
		} catch (error) {
			setLoadingFlag(false);
			alert.error('Erro ao tentar inserir produto no carrinho.');
		}
	}

	return (
		<div>
			{
				!loadingFlag ? (
					<div>
						<Navbar current={"menu"} clickCartMobile={() => setOpenCart(!openCart)} />
						<Header title={'Cardápio'} listProducts={true} />
						<main>
							<div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 h-screen">
								<div className="px-4 py-6 sm:px-0">
									<div className="rounded-lg">
										{
											products.length > 0 ? (
												<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
													{
														products.map((product) => {
															return (
																<CardProduct
																	key={product.id}
																	nameProduct={product.name}
																	imageProduct={product.image}
																	price={product.price}
																	description={product.description}
																	showModal={
																		product.is_product_misto ?
																			() => changeProduct(product.id, product.id_2)
																			:
																			() => changeProduct(product.id, null)
																	}
																/>
															)
														})
													}
												</div>
											) : (
												<MessageIsEmpty
													title="Não existe produto cadastrado com essas opções."
												/>
											)
										}

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
						<ModalAddCart
							show={showModal}
							product={productCart}
							closeModal={() => setShowModal(false)}
							addCartProduct={(quantity, additional) => addCartProduct(quantity, additional)}
							additionals={additionals}
						/>
					</div>
				) : (
					<Loading time={5000} />
				)
			}
		</div>
	);
}
export default ListProducts;
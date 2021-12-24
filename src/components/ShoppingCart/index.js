import React, { useState, useEffect } from "react";
import { useAlert } from "react-alert";
import API, { API_SOCKET } from "../../server/api.js";
import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import pie_default from "../../images/pie.png";
import empty_default from "../../images/empty_product.jpeg";
import empty_cart from "../../images/empty-cart.png";
import { changeCommaForPoint, getIdCompany } from "../../helpers.js";
import ModalAddressClient from "../ModalAddressClient";
import Loading from "../Loading";
import "../../index.css";

import io from "socket.io-client";
const socket = io(API_SOCKET);

const ShoppingCart = (props) => {
	const ID_COMPANY = getIdCompany();
	const idClient = localStorage.getItem('@masterpizza-delivery-app/id_client')

	const [dataProducts, setDataProducts] = useState([]);
	const [priceTotal, setPriceTotal] = useState(0);
	const [showModalAddress, setShowModalAddress] = useState(false);
	const [loadingFlag, setLoadingFlag] = useState(false);
	//const [valueDiscount, setValueDiscount] = useState(0);
	const alert = useAlert();

	useEffect(() => {
		getCartProduct();
	}, [])

	const getCartProduct = async () => {
		try {
			const response = await API.get("cart_product/" + idClient + "/" + ID_COMPANY);
			let array = [];
			let price = 0;
			response.data.forEach((product) => {
				if (product.id_product_fk && product.id_product_fk2) {
					array.push({
						id: product.id,
						name: product.observation,
						size: product.size,
						price: product.price_item_order,
						quantity: product.quantity_item,
						image: pie_default,
						is_product_mister: true
					})
				} else {
					array.push({
						id: product.id,
						name: product.name_product || product.name,
						size: product.size,
						price: product.price_item_order,
						quantity: product.quantity_item,
						image: product.image ? `https://api-master-pizza.herokuapp.com/${product.image}` : empty_default,
						is_product_mister: false
					});
				}
				price += product.price_item_order;
			})
			setPriceTotal(price);
			setDataProducts(array);
		} catch (error) {
			console.log('Erro ao tentar acessar carrinho. Tente novamente!');
		}
	}


	const deleteItemCart = async (id) => {
		props.onLoading(true);
		try {
			const response = await API.delete("cart_product/" + id);
			if (response.status === 200) {
				getCartProduct();
				props.onLoading(false);
				alert.success(response.data.message);
			} else {
				props.onLoading(false);
				alert.error(response.data.message);
			}
		} catch (error) {
			props.onLoading(false);
			alert.error("Error ao tentar deletar item. Tente novamente!");
		}
	}

	const finishCart = async () => {
		//ATUALIZAR COLUNA -> completed_purchase
		try {
			const idCart = localStorage.getItem('@masterpizza-delivery-app/id_cart');
			const response = await API.put("cart_status", {
				idClient: idClient,
				idCart: idCart,
				idCompany: ID_COMPANY
			});
			return response.status === 200 ? true : false;
		} catch (error) {
			alert.error('Erro ao tentar finalizar pedido. Tente novamente!');
		}
	}

	const finishOrder = async (formAddress) => {
		setLoadingFlag(true);
		try {
			setShowModalAddress(!showModalAddress);
			let price_order = 0;
			let arrayIdsProducts = [];
			dataProducts.forEach((item) => {
				price_order += item.price;
				arrayIdsProducts.push(item.id);
			});
			let address = `Rua: ${formAddress.street};N°: ${formAddress.number_address};Bairro: ${formAddress.district}`
			const responseFinishOrder = await API.post("createOrder", {
				amount_paid: formAddress.amount_paid ? Number(formAddress.amount_paid.replace(",", ".")) : 0,
				price_final: price_order - formAddress.valueDiscount + formAddress.freight,
				freight: formAddress.freight,
				status_order: 0,
				is_pdv: false,
				observation: formAddress.observation || null,
				address_client: String(address),
				id_coupom_fk: formAddress.coupom ? formAddress.coupom.id_coupom : null,
				id_client_fk: idClient,
				id_company: ID_COMPANY,
				idsFormPayment: [formAddress.form_payment]
			});
			if (responseFinishOrder.status === 200) {
				const idOrder = responseFinishOrder.data.id_order;
				const responseProductOrder = await API.post("createProductsOrder",
					{
						id_order: idOrder,
						id_company: ID_COMPANY,
						ids_products: arrayIdsProducts
					}
				);
				if (responseProductOrder.status === 200) {
					const res = await finishCart();
					setLoadingFlag(false);
					if (res) {
						alert.success('Pedido enviado com sucesso! Acompanhe o andamento no seu perfil.');

						socket.emit("pedidorealizado", { msg: "Envio do pedido pelo delivery" });
						setTimeout(() => {
							window.location.href = "/profile";
						}, 1000);
					} else {
						alert.error('Erro no envio do pedido. Tente novamente!');
					}
				} else {
					setLoadingFlag(false);
					alert.error('Erro no envio do pedido. Tente novamente!');
				}
			} else {
				setLoadingFlag(false);
				alert.error('Erro no envio do pedido. Tente novamente!');
			}
		} catch (error) {
			setLoadingFlag(false);
			alert.error('Erro no envio do pedido. Tente novamente!');
		}
	}


	return (
		<Transition.Root show={props.open} as={Fragment}>
			{
				!loadingFlag ? (
					<div>
						<Dialog as="div" className="fixed inset-0 overflow-hidden w-full z-20" onClose={props.close}>
							<div className="absolute inset-0 overflow-hidden z-20">
								<Transition.Child
									as={Fragment}
									enter="ease-in-out duration-500"
									enterFrom="opacity-0"
									enterTo="opacity-100"
									leave="ease-in-out duration-500"
									leaveFrom="opacity-100"
									leaveTo="opacity-0"
								>
									<Dialog.Overlay className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
								</Transition.Child>

								<div className="fixed inset-y-0 right-0 pl-10 w-full flex z-20">
									<Transition.Child
										as={Fragment}
										enter="transform transition ease-in-out duration-500 sm:duration-700"
										enterFrom="translate-x-full"
										enterTo="translate-x-0"
										leave="transform transition ease-in-out duration-500 sm:duration-700"
										leaveFrom="translate-x-0"
										leaveTo="translate-x-full"
									>
										<div className="w-screen max-w-md">
											<div className="w-full h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
												{
													!showModalAddress ? (
														<div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
															<div className="flex items-start justify-between">
																<Dialog.Title className="text-lg font-medium text-gray-900">Meu carrinho</Dialog.Title>
																<div className="ml-3 h-7 flex items-center">
																	<button
																		type="button"
																		className="-m-2 p-2 text-gray-400 hover:text-gray-500"
																		onClick={props.close}
																	>
																		<span className="sr-only">Fechar</span>
																		<XIcon className="h-6 w-6" aria-hidden="true" />
																	</button>
																</div>
															</div>

															<div className="mt-8">
																{
																	dataProducts.length !== 0 ? (
																		<div className="flow-root">
																			<ul className="-my-6 divide-y divide-gray-200">
																				{dataProducts.map((product) => (
																					<li key={product.id} className="py-6 flex">
																						<div className="flex-shrink-0 w-14 h-14 border border-gray-200 rounded-md overflow-hidden">
																							<img
																								src={product.image}
																								alt="image_produto"
																								className="w-full h-full object-center object-cover"
																							/>
																						</div>
																						<div className="ml-4 flex-1 flex flex-col">
																							<div>
																								<div className="flex justify-between text-base font-medium text-gray-900">
																									<h3>
																										{product.name}
																									</h3>
																									<p className="ml-4">R$ {changeCommaForPoint(product.price)}</p>
																								</div>
																							</div>
																							<div className="flex-1 flex items-end justify-between text-sm">
																								<p className="text-gray-500">Qtd.: {product.quantity}</p>
																								<div className="flex">
																									<button
																										type="button"
																										className="font-medium text-indigo-600 hover:text-indigo-500"
																										onClick={() => deleteItemCart(product.id)}
																									>
																										Remover
																									</button>
																								</div>
																							</div>
																						</div>
																					</li>
																				))}
																			</ul>
																			<div className="border-t border-gray-200 py-4 px-4 sm:px-6">
																				<div className="flex justify-between text-base font-medium text-gray-900">
																					<p>Subtotal</p>
																					<p>R$ {changeCommaForPoint(priceTotal)}</p>
																				</div>
																				<div className="mt-4">
																					<button
																						className="flex justify-center w-full items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green"
																						onClick={() => setShowModalAddress(true)}
																					>
																						Finanlizar pedido
																					</button>
																				</div>
																			</div>
																		</div>
																	) : (
																		<div className="w-full m-auto">
																			<p className="w-full text-center text-black font-bold text-xl">
																				Seu carrinho está vázio!
																			</p>
																			<div className="flex justify-center mt-10">
																				<div>
																					<img
																						src={empty_cart}
																						className="rounded-full h-20 w-20 mt-12"
																						alt="cart-empty"
																					/>
																				</div>
																			</div>
																		</div>
																	)
																}
															</div>
														</div>
													) : (
														<ModalAddressClient
															showModalAddress={showModalAddress}
															close={() => setShowModalAddress(false)}
															onFinishOrder={(data) => finishOrder(data)}
														/>
													)
												}
											</div>
										</div>
									</Transition.Child>
								</div>
							</div>
						</Dialog>
					</div>
				) : (
					<Loading time={5000} />
				)
			}
		</Transition.Root>
	);
}
export default ShoppingCart;
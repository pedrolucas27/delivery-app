import React, { useState, useEffect } from "react";
//import socket from "socket.io";
import { useAlert } from 'react-alert';
import API from "../../server/api.js"
import { getIdCompany } from "../../helpers.js";
import { isLoggedIn } from "../../server/auth.js";
import Navbar from "../../components/Navbar";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ShoppingCartMobile from "../../components/ShoppingCart";
import Loading from "../../components/Loading";
import CardProfile from "../../components/CardProfile";
import LineOrder from "../../components/LineOrder";
import ModalDetailOrder from "../../components/ModalDetailOrder";
import "../../index.css";

import io from "socket.io-client";

const sound = require("../../sound-order/sound.mp3");

const Profile = () => {
	const ID_COMPANY = getIdCompany();
	const idClient = localStorage.getItem('@masterpizza-delivery-app/id_client');

	const [openCart, setOpenCart] = useState(false);
	const [showDetail, setShowDetail] = useState(false);
	const [loadingFlag, setLoadingFlag] = useState(false);
	const [logged, setLogged] = useState(false);
	const [dataOrders, setDataOrders] = useState([]);
	const [dataOrderDetail, setDataOrderDetail] = useState([]);
	const [dataUser, setDataUser] = useState("");
	const [tab, setTab] = useState(1);
	const tabs = [
		{ name: "Meus dados", id: 1 },
		{ name: "Meu pedidos", id: 2 }
	]
	const alert = useAlert();

	const [checkStatusOrder, setCheckStatusOrder] = useState(null);

	const socket = io(API);
	socket.on("pedidostatusserver", (data) => {
		var audio = new Audio(sound);

		console.log(audio)
		setCheckStatusOrder(data);
	});

	useEffect(() => {
		setLoadingFlag(true);
		isLoggedIn().then((response) => {
			setLogged(response);
			if (response) {
				loadingDataUser();
				loadingDataOrder();
			}
		}).catch((error) => {
			setLogged(false);
		});
		setTimeout(() => {
			setLoadingFlag(false);
		}, 2000);
	}, [checkStatusOrder]);

	const loadingDataOrder = () => {
		API.get("order-delivery-app/" + idClient + "/" + ID_COMPANY).then((response) => {
			let array = [];
			response.data?.forEach((item) => {
				array.push(item);
			})
			setDataOrders(array);
		}).catch((error) => {
			setLoadingFlag(false);
			alert.error('Erro no carragamento dos pedidos!');
		});
	}

	const loadingDataUser = () => {
		API.get("client/profile/" + idClient + "/" + ID_COMPANY).then((response) => {
			setDataUser(response.data[0]);
		}).catch((error) => {
			setLoadingFlag(false);
			alert.error('Erro no carragamento dos dados do usuário!');
		});
	}

	const updateDataUser = async (data) => {
		setLoadingFlag(true);
		if (data.phone_client.length === 15 && data.name_client.length > 1) {
			if ((data.email_client.includes('@')) && (data.email_client.includes('.'))) {
				API.put("client", data).then((response) => {
					setLoadingFlag(false);
					if (response.status === 200) {
						alert.success(response.data.message);
						window.location.href = "/profile";
					} else {
						alert.error(response.data.message);
					}
				}).catch((error) => {
					setLoadingFlag(false);
					alert.error("Erro ao tentar fazer o cadastro!");
				});
			} else {
				setLoadingFlag(false);
				alert.error("Informe um e-mail válido!");
			}
		} else {
			setLoadingFlag(false);
			alert.error("Preencha todos os campos pedidos!");
		}
	}


	return (
		<div>
			{
				loadingFlag ? (
					<Loading time={5000} />
				) : (
					<div>
						<audio preload="auto" src={sound}></audio>
						<Navbar clickCartMobile={() => setOpenCart(!openCart)} />
						<Header title={'Meu perfil'} />
						<main>
							<div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
								<div className="px-4 py-6 sm:px-0">
									<div className="rounded-lg h-96">

										<ul className="flex">
											{
												tabs.map((t) => (
													<li className="mr-3">
														<button
															className={
																t.id === tab ?
																	"inline-block border border-blue-500 rounded py-1 px-3 bg-blue-500 text-white"
																	:
																	"inline-block border border-white rounded text-blue-500 py-1 px-3"
															}
															onClick={() => setTab(t.id)}
														>
															{t.name}
														</button>
													</li>
												))
											}
										</ul>

										<div className="w-full">
											{
												tab === 1 ? (
													<div className="mt-10 container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
														<div className="bg-white px-6 py-4 rounded shadow-md text-black w-full">
															<CardProfile
																user={dataUser}
																updateDataClient={(data) => updateDataUser(data)}
															/>
														</div>
													</div>
												) : (
													<div className="mt-10 flex flex-col">
														<div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
															<div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
																<div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
																	<table className="min-w-full divide-y divide-gray-200">
																		<thead className="bg-gray-50">
																			<tr>
																				<th
																					scope="col"
																					className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
																				>
																					Pedido
																				</th>
																				<th
																					scope="col"
																					className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
																				>
																					Status
																				</th>
																				<th scope="col" className="relative px-6 py-3">
																					<span className="sr-only">Ação</span>
																				</th>
																			</tr>
																		</thead>
																		<tbody className="bg-white divide-y divide-gray-200">
																			{dataOrders.map((order) => (
																				<LineOrder
																					order={order}
																					showDetailOrder={() => {
																						setDataOrderDetail(order);
																						setShowDetail(!showDetail);
																					}}
																				/>
																			))}
																		</tbody>
																	</table>
																</div>
															</div>
														</div>
													</div>
												)
											}
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
						<ModalDetailOrder
							products={dataOrderDetail.products}
							additionals={dataOrderDetail.additionais}
							showModalDetail={showDetail}
							closeDetail={() => setShowDetail(!showDetail)}
						/>
					</div>
				)
			}
		</div>
	);
}
export default Profile;
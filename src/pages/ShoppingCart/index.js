import React, { useState,  useEffect } from "react";
import { useAlert } from "react-alert";
import { changeCommaForPoint, getIdCompany } from "../../helpers.js";
import API from "../../server/api.js";
import Navbar from "../../components/Navbar";
import Loading from "../../components/Loading";
import ModalAddressClient from "../../components/ModalAddressClient";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import pie_default from "../../images/pie.png";
import empty_default from "../../images/empty_product.jpeg";
import empty_cart from "../../images/empty-cart.png";
import "../../index.css";
const ShoppingCart = () => {
	const ID_COMPANY = getIdCompany();
	const idClient =  localStorage.getItem('@masterpizza-delivery-app/id_client');

	const [dataProducts, setDataProducts] = useState([]);
	const [priceTotal, setPriceTotal] = useState(0);
	const [loadingFlag, setLoadingFlag] = useState(false);
	const [nameCoupom, setNameCoupom] = useState(null);
	const [showModalAddress, setShowModalAddress] = useState(false);
	const [coupom, setCoupom] = useState(null);
	const [valueDiscount, setValueDiscount] = useState(0);
	const [quantityItemCart, setQuantityItemCart] = useState(0);
	const alert = useAlert();

	useEffect(() => {
		setLoadingFlag(true);
		getCartProduct();
		setLoadingFlag(false);
	}, []);

	const getCartProduct = async () => {
		setLoadingFlag(true);
		try{
			const response = await API.get("cart_product/"+idClient+"/"+ID_COMPANY);
			let array = [];
			let price = 0;
			let quantity = 0;
			response.data.forEach((product) => {
				if(product.id_product_fk && product.id_product_fk2){
					array.push({
						id: product.id,
						name: product.observation,
						size: product.size,
						price: product.price_item_order,
						quantity: product.quantity_item,
						image: pie_default,
						is_product_mister: true
					})
				}else{
					array.push({
						id: product.id,
						name: product.name_product || product.name,
						size: product.size,
						price: product.price_item_order,
						quantity: product.quantity_item,
						image: product.image ? `http://192.168.0.107:8080/${product.image}`:empty_default,
						is_product_mister: false
					});
				}
				price += product.price_item_order;
				quantity += product.quantity_item;
			})
			setPriceTotal(price);
			setQuantityItemCart(quantity);
			setDataProducts(array);
			setLoadingFlag(false);
		} catch(error){
			setLoadingFlag(false);
			alert.error('Erro ao tentar acessar carrinho. Tente novamente!');
		}
	}

	const deleteItemCart = async (id) => {
	    setLoadingFlag(true);
		try{
		    const response = await API.delete("cart_product/"+id);
		    if(response.status === 200){
		    	getCartProduct();
		        setLoadingFlag(false);
		        alert.success(response.data.message);
		   	}else{
		      	setLoadingFlag(false);
		        alert.error(response.data.message);
		    }
		}catch(error){
		    setLoadingFlag(false);
		    alert.error("Error ao tentar deletar item. Tente novamente!");
	    }
  	}

  	const getCoupomChangeName = async () => {
		if(nameCoupom){
			API.get("coupom/"+nameCoupom+"/"+ID_COMPANY).then((response) => {
				if(response.status === 200){
					if(response.data){
						setCoupom(response.data[0]);
						setValueDiscount(response.data[0].value_discount)
					}
				}
			}).catch((error) => {
				alert.error("Erro de comunicação com o servidor ao tentar buscar cupom.");
			});
		}else{
			alert.error("Informe um cupom válido para poder aplicar!");
		}
	}

	const finishCart = async () => {
		//ATUALIZAR COLUNA -> completed_purchase
		try{
			const response = await API.put("cart_status", { idClient: idClient, idCompany: ID_COMPANY });
			return response.status === 200 ? true:false;
		}catch(error){
			alert.error('Erro ao tentar finalizar pedido. Tente novamente!');
		}
	}

  	const finishOrder = async (formAddress) => {
		setLoadingFlag(true);
		try{
			setShowModalAddress(!showModalAddress);
			let price_order = 0;
			let arrayIdsProducts = [];
			dataProducts.forEach((item) => { 
				price_order += item.price;
				arrayIdsProducts.push(item.id);
			});
			let address = `Rua: ${formAddress.street};N°: ${formAddress.number_address};Bairro: ${formAddress.district}`
		    const responseFinishOrder = await API.post("createOrder", {
			    price: price_order - valueDiscount, 
			    price_final: price_order - valueDiscount,
			    status_order: 0, 
			    is_pdv: false, 
			    observation: formAddress.observation || null, 
			    address_client: String(address),
			    id_coupom_fk: formAddress.coupom ? formAddress.coupom.id_coupom:coupom ? coupom.id_coupom:null, 
			    id_client_fk: idClient,
			    id_company: ID_COMPANY,
			    idsFormPayment: [formAddress.form_payment]
		    });
		    if(responseFinishOrder.status === 200){
		    	const idOrder = responseFinishOrder.data.id_order;
		    	const responseProductOrder = await API.post("createProductsOrder",
					{
						id_order: idOrder,
						id_company: ID_COMPANY,
						ids_products: arrayIdsProducts
					}
				);
				if(responseProductOrder.status === 200){
					const res = await finishCart();
					setLoadingFlag(false);
					if(res){
						alert.success('Pedido enviado com sucesso! Acompanhe o andamento no seu perfil.');
						setTimeout(() => {
		                    window.location.href = "/profile";
		                }, 1000);
					}else{
						alert.error('Erro no envio do pedido. Tente novamente!');
					}	
				}else{
					setLoadingFlag(false);
					alert.error('Erro no envio do pedido. Tente novamente!');
				}
		    }else{
		    	setLoadingFlag(false);
		    	alert.error('Erro no envio do pedido. Tente novamente!');
		    }
		} catch(error){
			setLoadingFlag(false);
			alert.error('Erro no envio do pedido. Tente novamente!');
		}
  	}

	return(
		<div>
			{
				!loadingFlag ? (
					<div>
						<Navbar />
						<Header title={'Meu carrinho'} />
						<main>
							<div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
			      				<div className="px-4 py-6 sm:px-0">
			        				<div className="rounded-lg h-96">
				        				{
				        					dataProducts.length !== 0 ? (
				        						<div className="container mx-auto mb-0 bg-gray-100">
									    			<div className="flex shadow-md my-5">
											    		<div className="w-3/4 bg-white px-10 py-5">
												        	<div className="flex mt-5 mb-5">
														        <h3 className="font-semibold text-gray-600 text-xs uppercase w-2/5">Produto</h3>
														        <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5 text-center">Quantidade</h3>
														        <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5 text-center">Preço</h3>
														        <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5 text-center">Total</h3>
												        	</div>
												        	{
												        		dataProducts.map((product, index) => (
												        			<div key={index} className="flex items-center hover:bg-gray-100 -mx-8 px-6 py-5">
														          		<div className="flex w-2/5">
																            <div className="w-20">
																              <img className="h-24 w-24" src={product.image} alt="imgProduct" />
																            </div>
																            <div className="flex flex-col justify-between ml-5">
																              <p className="font-bold text-x1">{product.name}</p>
																              <button onClick={() => deleteItemCart(product.id)} className="ml-5 font-semibold hover:text-red-500 text-gray-500 text-xs">Remove</button>
																            </div>
														          		</div>
																        <div className="flex justify-center w-1/5">
																            <p className="text-lg text-black text-center">
																            	{product.quantity}
																            </p>
																        </div>
																        <span className="text-center w-1/5 font-semibold text-sm">R$ {changeCommaForPoint(product.price / product.quantity)}</span>
																        <span className="text-center w-1/5 font-semibold text-sm">R$ {changeCommaForPoint(product.price)}</span>
												        			</div> 
												        		))
												        	}
													        <a href="/menu" className="flex font-semibold text-indigo-600 text-sm mt-10">
													          <svg className="fill-current mr-2 text-indigo-600 w-4" viewBox="0 0 448 512"><path d="M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z"/></svg>
													          Continuar comprando
													        </a>
											      		</div>

													    <div id="summary" className="w-1/4 px-8 py-10">
													        <h1 className="font-semibold text-2xl border-b pb-5">Resumo</h1>
													        <div className="flex justify-between mt-10 mb-2">
													          	<span className="font-semibold text-sm">Item(s) {quantityItemCart}</span>
													          	<span className="font-semibold text-sm">R$ {changeCommaForPoint(priceTotal)}</span>
													        </div>
													        <div className="py-2">
													        	<span>Possui cupom ?</span>
													          	<input 
										                      		type="text"
										                        	className="mt-1 block border border-grey-light w-full p-2 rounded mb-1"
									                        		placeholder="Cupom"
									                        		onChange={(e) => setNameCoupom(e.target.value)} 
									                        	/>
									                        	{
									                        		valueDiscount !== 0 && (
									                        			<div className="mt-10">
									                        				<p className="text-md text-black font-semibold">
									                        					Você terá um desconto de R${changeCommaForPoint(valueDiscount)}
									                        				</p>
									                        			</div>
									                        		)
									                        	}									                        	
													        </div>
													        <button className="w-full text-center py-2 rounded-md bg-red text-white" onClick={getCoupomChangeName}>
													        	Aplicar
													        </button>
													        <div className="border-t mt-5">
													          <div className="flex font-semibold justify-between py-6 text-sm">
													            <span>Total da conta</span>
													            <span>R$ {changeCommaForPoint(priceTotal - valueDiscount)}</span>
													          </div>
													          <button 
													          	className="bg-green w-full text-center py-2 rounded-md text-white"
													          	onClick={() => setShowModalAddress(true)}
													          >
													          	Finalizar pedido
													          </button>
													        </div>
													      </div>
											    		</div>
									  				
			        							</div>
				        					):(
				        						<div className="w-full m-auto">
							                    	<p className="w-full text-center text-black font-bold text-xl">
							                   			Seu carrinho está vázio!
							                      	</p>
							                      	<div className="flex justify-center mt-10">
								                      	<div>
								                      		<img src={empty_cart} className="rounded-full h-24 w-24" alt="cart-empty" className="h-16 w-16 mt-12" />
								                   		</div>
													</div>
							                    </div>
				        					)
				        				}
			      					</div>
			   					</div>	
			   				</div>
							<ModalAddressClient
								show={showModalAddress}
								close={() => setShowModalAddress(false)}
								onFinishOrder={(data) => finishOrder(data)}
							/>					
						</main>
						<Footer />
					</div>
				):(
					<Loading time={5000}/>
				)
			}
  		</div>
	);
}
export default ShoppingCart;

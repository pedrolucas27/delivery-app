import React from "react";
import "../../index.css";
const ModalDetailOrder = (props) => {
	return (
		<div className={
			props.showModalDetail ?
				"overflow-y-visible overflow-x-hidden fixed w-full h-full top-0 left-0 flex items-center justify-center"
				:
				"modal opacity-0 pointer-events-none fixed w-full h-full top-0 left-0 flex items-center justify-center"
		}>
			<div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
			<div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
				<div className="modal-close absolute top-0 right-0 cursor-pointer flex flex-col items-center mt-4 mr-4 text-white text-sm z-50">
				</div>
				<div className="modal-content py-4 px-6 rounded-lg">
					<div className="flex justify-between items-center pb-3">
						<p className="text-lg font-semibold mb:2 ">Detalhes do pedido</p>
						<div className="modal-close cursor-pointer z-50" onClick={() => props.closeDetail()}>
							<svg
								className="fill-current text-black"
								xmlns="http://www.w3.org/2000/svg"
								width="18"
								height="18"
								viewBox="0 0 18 18"
							>
								<path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
							</svg>
						</div>
					</div>
					<div className="grid grid-cols-1">
						{
							(props?.products && props?.products?.lenght !== 0) && (
								<div className="w-full mt-5">
									<p className="w-full text-1xl font-bold">
										Produtos
									</p>
									{
										props.products.map((product) => (
											<p className="w-full text-md text-black">
												{product.quantity_item}x {product.name_product}
											</p>
										))
									}
								</div>
							)
						}

						{
							(props?.additionals && props?.additionals?.lenght !== 0) && (
								<div className="w-full mt-5">
									<p className="w-full text-1xl font-bold">
										Adicionais
									</p>
									{
										props.additionals.map((additional) => (
											<p className="w-full text-md text-black">
												{additional.quantity_item}x {additional.name}
											</p>
										))
									}
								</div>
							)
						}
					</div>
					<div className="flex justify-end pt-2">
						<button className="mr-2 bg-red p-2 rounded-lg text-white" onClick={() => props.closeDetail()}>Fechar</button>
					</div>
				</div>
			</div>
		</div>
	);
}
export default ModalDetailOrder;
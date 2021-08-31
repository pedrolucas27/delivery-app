import React from "react";
import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import "../../index.css";


const products = [
  {
    id: 1,
    name: 'Throwback Hip Bag',
    href: '#',
    color: 'Salmon',
    price: '$90.00',
    quantity: 1,
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-01.jpg',
    imageAlt: 'Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt.',
  },
  {
    id: 2,
    name: 'Medium Stuff Satchel',
    href: '#',
    color: 'Blue',
    price: '$32.00',
    quantity: 1,
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-02.jpg',
    imageAlt:
      'Front of satchel with blue canvas body, black straps and handle, drawstring top, and front zipper pouch.',
  }
]


const ShoppingCart = (props) => {
	return(
		<Transition.Root show={props.open} as={Fragment}>
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
				                      	<div className="flow-root">
				                        	<ul className="-my-6 divide-y divide-gray-200">
				                          		{products.forEach((product) => (
				                            		<li key={product.id} className="py-6 flex">
				                              			<div className="flex-shrink-0 w-14 h-14 border border-gray-200 rounded-md overflow-hidden">
				                                			<img
							                                  	src={product.imageSrc}
							                                  	alt={product.imageAlt}
							                                  	className="w-full h-full object-center object-cover"
				                                			/>
				                              			</div>
				                              			<div className="ml-4 flex-1 flex flex-col">
				                                			<div>
				                                  				<div className="flex justify-between text-base font-medium text-gray-900">
				                                    				<h3>
				                                      					<a href={product.href}>{product.name}</a>
				                                    				</h3>
				                                    				<p className="ml-4">{product.price}</p>
				                                  				</div>
				                                			</div>
				                                			<div className="flex-1 flex items-end justify-between text-sm">
				                                  				<p className="text-gray-500">Qtd.: {product.quantity}</p>
				                                  				<div className="flex">
								                                    <button type="button" className="font-medium text-indigo-600 hover:text-indigo-500">
								                                      Remover
								                                    </button>
				                                  				</div>
				                                			</div>
				                              			</div>
				                            		</li>
				                          		))}
				                        	</ul>
				                      	</div>
				                    </div>
				                </div>

				                <div className="border-t border-gray-200 py-4 px-4 sm:px-6">
				                    <div className="flex justify-between text-base font-medium text-gray-900">
				                      	<p>Subtotal</p>
				                      	<p>$262.00</p>
				                    </div>
				                    <div className="mt-4">
				                      	<a
					                        href="#"
					                        className="flex justify-center items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
				                      	>
				                        	Finanlizar pedido
				                      	</a>
				                    </div>
				                  </div>
				                </div>
	            			</div>
            			</Transition.Child>
          			</div>
        		</div>
      		</Dialog>
    	</Transition.Root>
	);
}
export default ShoppingCart;
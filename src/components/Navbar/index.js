import React, { useState, useEffect } from "react";
import { useAlert } from "react-alert";
import API from "../../server/api.js";
import { getIdCompany } from "../../helpers.js";
import { Fragment } from 'react'
import { Disclosure } from '@headlessui/react'
import { ShoppingCartIcon, MenuIcon, XIcon } from '@heroicons/react/outline';
import logo from "../../images/logo_mp.png";
import { isLoggedIn } from "../../server/auth.js";
import "../../index.css";

const navigation = [
  { name: 'Cardápio', href:"/menu", current: 'menu' },
  { name: 'Estabelecimento', href:"/company", current: 'company' },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const Navbar = (props) => {
  const ID_COMPANY = getIdCompany();

  const [logged, setLogged] = useState(false);
  const [quantityItemCart, setQuantityItemCart] = useState(0);
  const alert = useAlert();
  useEffect(() => {
    isLoggedIn().then((response) => {
      setLogged(response);
      if(response){
        getCartProduct();
      }
    }).catch((error) => {
      setLogged(false);
    });
  }, [])

  const clickCart = () => {
    if(logged){
      if(window.innerWidth > 1090){
        window.location.href = "/shopping-cart"
      }else{
        props.clickCartMobile();
      }
    }else{
      alert.error("Faça o login antes.");
    }
  }

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  }

  const viewProfile = () => {
    window.location.href = "/profile";
  }

  const getCartProduct = async () => {
      try{
        const idClient = localStorage.getItem('@masterpizza-delivery-app/id_client');
        const response = await API.get("cart_product/"+idClient+"/"+ID_COMPANY);
        setQuantityItemCart(response.data.length);
      } catch(error){
        console.log('Erro ao tentar acessar carrinho. Tente novamente!');
      }
  }

	return(
		<Disclosure as="nav" className="bg-red">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-red hover:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex-shrink-0 flex items-center">
                  <img
                    className="block lg:hidden h-12 w-12"
                    src={logo}
                    alt="Logo"
                  />
                  <h1 className="hidden lg:block h-8 w-auto font-bold text-xl text-white px-3 py-1">
                    Master Pizza
                  </h1>
                </div>
                <div className="hidden sm:block sm:ml-6">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current === props.current ? 'bg-white text-red' : 'text-white hover:bg-white hover:text-red',
                          'px-3 py-2 rounded-md text-sm font-medium'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="h-8 w-auto flex items-center px-5 hidden sm:block sm:ml-6">
                {
                  logged ? (
                    <button onClick={() => logout()} className="mr-5 bg-transparent text-white rounded inline-flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Sair</span>
                    </button>
                  ):(
                    <a href="/login" className="-m-2 mx-8 p-2 font-medium text-white">
                      Entrar
                    </a>
                  )
                }
                
                {
                  !logged ? (
                    <a
                      href="/register"
                      className='bg-yellow text-white px-3 py-2 rounded-md text-sm font-medium'
                    >
                      Criar conta
                    </a>
                  ):(
                    <button onClick={() => viewProfile()} className="bg-transparent text-white rounded inline-flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Meu perfil</span>
                    </button>
                  )
                }
                
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <button
                  type="button"
                  className="bg-red p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                  onClick={clickCart}
                >
                      <a href="#!" className="group -m-2 p-2 flex items-center">
                        <ShoppingCartIcon
                          className="flex-shrink-0 h-8 w-8 text-white group-hover:text-white"
                          aria-hidden="true"
                        />
                        <span className="ml-2 text-sm font-medium text-white group-hover:text-white">{quantityItemCart}</span>
                        <span className="sr-only">items in cart, view bag</span>
                      </a>
                </button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    item.current === props.current ? 'bg-white text-red' : 'text-white hover:bg-white hover:text-red',
                    'block px-3 py-2 rounded-md text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </a>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-white">
              <div className="flex items-center px-5">
                {
                  logged ? (
                    <button onClick={() => logout()} className="mr-5 bg-transparent text-white rounded inline-flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Sair</span>
                    </button>
                  ):(
                    <a href="/login" className="-m-2 mx-8 p-2 font-medium text-white">
                      Entrar
                    </a>
                  )
                }
                
                {
                  !logged ? (
                    <a
                      href="/register"
                      className='bg-yellow text-white px-3 py-2 rounded-md text-sm font-medium'
                    >
                      Criar conta
                    </a>
                  ):(
                    <button onClick={() => viewProfile()} className="bg-transparent text-white rounded inline-flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Meu perfil</span>
                    </button>
                  )
                }
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
	)
}
export default Navbar;


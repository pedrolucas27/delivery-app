import React from "react";
import logo from "../../images/logo_mp.png";
import "../../index.css";

const LandingPage = () => {
	return( 
		<div className="relative bg-red overflow-hidden">
      <div className="pt-16 pb-80 sm:pt-24 sm:pb-40 lg:pt-40 lg:pb-48">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 sm:static">
          <div className="sm:max-w-lg">
            <h1 className="text-4xl font font-extrabold tracking-tight text-white sm:text-6xl">
              A melhor pizza da região
            </h1>
            <p className="mt-4 text-xl text-gray-500">
              This year, our new summer collection will shelter you from the harsh elements of a world that doesn't care
              if you live or die.
            </p>
          </div>

          <div>
            <div className="mt-10">
              <div
                aria-hidden="true"
                className="pointer-events-none lg:absolute lg:inset-y-0 lg:max-w-7xl lg:mx-auto lg:w-full"
              >
                <div className="absolute transform sm:left-1/2 sm:top-0 sm:translate-x-8 lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-8">
                  <div className="flex items-center space-x-6 lg:space-x-8">
                    
                      <div className="w-full h-full overflow-hidden">
                        <img
                          src={logo}
                          alt=""
                          className="w-full h-full object-center object-cover"
                        />
                      </div>
                     
                    </div>
                  </div>
                </div>
              </div>

              <a
                href="/menu"
                className="inline-block text-center bg-yellow border border-transparent rounded-md py-3 px-8 font-medium text-white"
              >
                Ver cardápio
              </a>
            </div>
          </div>
        </div>
      </div>
   	)
}
export default LandingPage;



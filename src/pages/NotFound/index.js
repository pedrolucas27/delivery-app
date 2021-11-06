import React from "react";
import imageNotFound from '../../images/icons8-error-100.png';

const NotFound = () => {
	const redirectPage = () => {
		window.location.href = 'menu';
	}
	return (
		<div className='container-main-page-not-found'>
			<div className="w-full m-auto">
				<div className="flex justify-center mb-15" >
					<img className="h-24 w-24" src={imageNotFound} alt="image_not_found" />
				</div>
				<br></br>
				<p className="w-full text-center text-black font-bold text-xl">
					A rota que você tentou acessar não existe.
				</p>
				<br></br>
				<br></br>
				<p className="mt:15 w-full text-center text-black font-bold text-xl">
					<button
						onClick={() => redirectPage()}
						className="mt-15 text-center p-2 rounded bg-yellow text-white sm:p-3"
					>Voltar para o cardápio</button>
				</p>
			</div>
		</div>
	);
}
export default NotFound;
import React from "react";
import "../../index.css";
const Header = ({ title, timeWork, isOpenDay }) => {
	const isOpenDayCompany = isOpenDay ? true : false;
	const isOpenEstablishment = (timeWork) => {
		let flag = false;
		if (timeWork[0]) {
			let startTime = `${Number(timeWork[0].split(':')[0]) + 12}:${timeWork[0].split(':')[1]}:${timeWork[0].split(':')[2]}`;
			let endTime = `${Number(timeWork[1].split(':')[0]) + 12}:${timeWork[1].split(':')[1]}:${timeWork[1].split(':')[2]}`;
			let currentTime = `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`;
			if (currentTime >= startTime && currentTime <= endTime) {
				flag = true;
			}
		}
		return flag;
	}
	return (
		<header className="bg-white shadow">
			<div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
				<h1 className="text-3xl font-bold text-black">
					{title}
				</h1>
				{
					isOpenDay ? (
						timeWork && isOpenEstablishment(timeWork) ? (
							<span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-green rounded">
								ABERTO AGORA
							</span>
						) : (
							<span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red rounded">
								FECHADO AGORA
							</span>
						)
					) : (
						<span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red rounded">
							FECHADO AGORA
						</span>
					)
				}

			</div>
		</header>
	);
}
export default Header;

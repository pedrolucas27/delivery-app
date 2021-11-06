import React from "react";
import moment from "moment";
import { changeCommaForPoint } from "../../helpers.js";
import "../../index.css";
const LineOrder = (props) => {
	return (
		<tr key={props.order.id_order}>
			<td className="px-6 py-4 whitespace-nowrap">
				<div className="text-sm text-gray-900">Cód.: {props.order.code}</div>
				<div className="text-xs text-gray-500">{moment(props.order.data_order).format("DD-MM-YYYY [ás] HH:mm:ss")}</div>
				<div className="text-sm text-green font-bold">R$ {changeCommaForPoint(props.order.price_final)}</div>
			</td>
			<td className="px-2 py-2 whitespace-nowrap">
				{
					(props.order.status_order === 0) && (
						<span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-yellow rounded">
							EM ANÁLISE
						</span>
					)
				}

				{
					(props.order.status_order === 1) && (
						<span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-orange rounded">
							EM PRODUÇÃO
						</span>
					)
				}

				{
					(props.order.status_order === 2) && (
						<span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-green rounded">
							FINALIZADO
						</span>
					)
				}

				{
					(props.order.status_order === 3) && (
						<span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-black bg-gray-200 rounded">
							ENTREGUE
						</span>
					)
				}

			</td>
			<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
				<button
					className="font-medium text-indigo-600 hover:text-indigo-500"
					onClick={() => props.showDetailOrder()}
				>
					Ver
				</button>
			</td>
		</tr>
	);
}
export default LineOrder;

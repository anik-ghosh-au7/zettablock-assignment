import React from 'react';
import { ReactComponent as DeleteSvg } from '../icons/delete.svg';
import { ReactComponent as EditSvg } from '../icons/edit.svg';
import { ReactComponent as MaximizeSvg } from '../icons/maximize.svg';
import { ReactComponent as MinimizeSvg } from '../icons/minimize.svg';

const DataTable = ({ apiData = [] }) => {
	console.log('apiData ==>> ', apiData);
	const formatDateStr = (str) => {
		return str.split('T')[0].split('-').reverse().join('/');
	};
	return (
		<div className="container">
			<h2>APIs: </h2>
			<table>
				<thead>
					<tr>
						<th></th>
						<th>ID</th>
						<th>Name</th>
						<th>Type</th>
						<th>Description</th>
						<th>Created at</th>
						<th>Updated at</th>
					</tr>
				</thead>
				<tbody>
					{apiData.slice(0, 6).map((data) => (
						<tr key={data.id}>
							<td data-column="actions">
								<div>
									<button>
										<DeleteSvg />
									</button>
									<button>
										<EditSvg />
									</button>
									<button>
										<MaximizeSvg />
									</button>
								</div>
								<input type="radio" checked="checked"></input>
							</td>
							<td data-column="id">{data.id}</td>
							<td data-column="name">{data.name}</td>
							<td data-column="type">{data.type}</td>
							<td data-column="description">{data.description}</td>
							<td data-column="createdAt">{formatDateStr(data.createdAt)}</td>
							<td data-column="updatedAt">{formatDateStr(data.updatedAt)}</td>
						</tr>
					))}
				</tbody>
			</table>
			<div className="pagination-container">
				<nav>
					<ul className="pagination">
						<li data-page="prev">
							<span>
								{'<'}
								<span className="sr-only">(current)</span>
							</span>
						</li>
						<li data-page="next" id="prev">
							<span>
								{'>'}
								<span className="sr-only">(current)</span>
							</span>
						</li>
					</ul>
				</nav>
			</div>
		</div>
	);
};

export default DataTable;

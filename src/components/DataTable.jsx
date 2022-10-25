import React, { Fragment, useState } from 'react';
import { ReactComponent as DeleteSvg } from '../icons/delete.svg';
import { ReactComponent as EditSvg } from '../icons/edit.svg';
import { ReactComponent as MaximizeSvg } from '../icons/maximize.svg';
import { ReactComponent as MinimizeSvg } from '../icons/minimize.svg';

const formatDateStr = (str) => {
	return str.split('T')[0].split('-').reverse().join('/');
};

const DataTable = ({ apiData = [] }) => {
	console.log('apiData ==>> ', apiData);
	const [selectedData, setSelectedData] = useState();
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
					{/* for testing */}
					{apiData.slice(0, 6).map((data) => (
						<Fragment key={data.id}>
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
									<input
										type="radio"
										readOnly
										checked={selectedData?.id === data.id}
									></input>
								</td>
								<td data-column="id">{data.id}</td>
								<td data-column="name">{data.name}</td>
								<td data-column="type">{data.type}</td>
								<td data-column="description">{data.description}</td>
								<td data-column="createdAt">{formatDateStr(data.createdAt)}</td>
								<td data-column="updatedAt">{formatDateStr(data.updatedAt)}</td>
							</tr>
							<tr style={{ display: 'visible' }}>
								<td colSpan="7">
									<br />
									hidden row
									<br />
									hidden row
									<br />
									hidden row
								</td>
							</tr>
						</Fragment>
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

import React, { Fragment, useEffect, useState } from 'react';
import { actionTypes } from '../constants';
import { ReactComponent as DeleteSvg } from '../icons/delete.svg';
import { ReactComponent as EditSvg } from '../icons/edit.svg';
import { ReactComponent as MaximizeSvg } from '../icons/maximize.svg';
import { ReactComponent as MinimizeSvg } from '../icons/minimize.svg';
import { ReactComponent as CopySvg } from '../icons/copy.svg';
import { formatDateStr, copyTextToClipboard } from '../utils';

const DataTable = ({ apiData = [] }) => {
	console.log('apiData ==>> ', apiData);
	const [apiList, setApiList] = useState([]);
	const [paginationData, setPaginationData] = useState({
		limit: 5,
		page: 1,
		offset: 0,
		total: 0,
		maxPages: 1,
	});
	const [selectedData, setSelectedData] = useState({
		data: null,
		action: null,
	});
	const actionHandler = async (currentAction, currentData) => {
		setSelectedData({ action: currentAction, data: currentData });
	};
	useEffect(() => {
		setApiList(
			apiData.slice(
				paginationData.offset,
				paginationData.offset + paginationData.limit
			)
		);
	}, [apiData, paginationData]);
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
					{apiList.map((data) => {
						const strData = JSON.stringify(data, null, '\t').replace(
							/\\n/g,
							''
						);
						return (
							<Fragment key={data.id}>
								<tr key={data.id}>
									<td data-column="actions">
										<div>
											<button
												onClick={() => actionHandler(actionTypes.DELETE, data)}
											>
												<DeleteSvg />
											</button>
											<button
												onClick={() => actionHandler(actionTypes.EDIT, data)}
											>
												<EditSvg />
											</button>
											{selectedData.action === actionTypes.MAXIMIZE &&
											selectedData.data?.id === data.id ? (
												<button
													onClick={() =>
														actionHandler(actionTypes.MINIMIZE, data)
													}
												>
													<MinimizeSvg />
												</button>
											) : (
												<button
													onClick={() =>
														actionHandler(actionTypes.MAXIMIZE, data)
													}
												>
													<MaximizeSvg />
												</button>
											)}
										</div>
										<input
											readOnly
											type="radio"
											checked={selectedData.data?.id === data.id}
										></input>
									</td>
									<td data-column="id">{data.id}</td>
									<td data-column="name">{data.name}</td>
									<td data-column="type">{data.type}</td>
									<td data-column="description">{data.description}</td>
									<td data-column="createdAt">
										{formatDateStr(data.createdAt)}
									</td>
									<td data-column="updatedAt">
										{formatDateStr(data.updatedAt)}
									</td>
								</tr>
								{selectedData.action === actionTypes.MAXIMIZE &&
									selectedData.data?.id === data.id && (
										<tr>
											<td colSpan="7">
												<code className="json__content">
													<pre>{strData}</pre>
													<button onClick={() => copyTextToClipboard(strData)}>
														<CopySvg />
													</button>
												</code>
											</td>
										</tr>
									)}
							</Fragment>
						);
					})}
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

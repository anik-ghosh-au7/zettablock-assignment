import React, { Fragment, useEffect, useState } from 'react';
import { actionTypes, paginationActions } from '../constants';
import { ReactComponent as DeleteSvg } from '../icons/delete.svg';
import { ReactComponent as EditSvg } from '../icons/edit.svg';
import { ReactComponent as MaximizeSvg } from '../icons/maximize.svg';
import { ReactComponent as MinimizeSvg } from '../icons/minimize.svg';
import { ReactComponent as CopySvg } from '../icons/copy.svg';
import { formatDateStr, copyTextToClipboard, getMaxPages } from '../utils';

const DataTable = ({ apiData }) => {
	const [apiList, setApiList] = useState([]);
	const [maxPages, setMaxPages] = useState(1);
	const [paginationData, setPaginationData] = useState({
		limit: 5,
		page: 1,
		offset: 0,
		total: apiData?.length || 0,
	});
	const [selectedData, setSelectedData] = useState({
		data: null,
		action: null,
	});
	const actionHandler = async (currentAction, currentData) => {
		setSelectedData({ action: currentAction, data: currentData });
	};
	const paginationHandler = (action, payload = undefined) => {
		switch (action) {
			case paginationActions.PREV:
				setPaginationData({
					...paginationData,
					page: paginationData.page - 1,
					offset: paginationData.offset - paginationData.limit,
				});
				break;
			case paginationActions.NEXT:
				setPaginationData({
					...paginationData,
					page: paginationData.page + 1,
					offset: paginationData.offset + paginationData.limit,
				});
				break;
			case paginationActions.FIRST:
				setPaginationData({
					...paginationData,
					page: 1,
					offset: 0,
				});
				break;
			case paginationActions.LAST:
				setPaginationData({
					...paginationData,
					page: maxPages,
					offset: (maxPages - 1) * paginationData.limit,
				});
				break;
			case paginationActions.GOTO:
				let gotoPageNumber;
				if (payload.pageNumber > maxPages) {
					gotoPageNumber = maxPages;
				} else if (payload.pageNumber <= 0) {
					gotoPageNumber = 1;
				} else {
					gotoPageNumber = payload.pageNumber;
				}
				setPaginationData({
					...paginationData,
					page: gotoPageNumber,
					offset: (gotoPageNumber - 1) * paginationData.limit,
				});
				break;
			case paginationActions.SHOW:
				break;
			default:
				break;
		}
	};
	useEffect(() => {
		if (apiData?.length) {
			setPaginationData({
				limit: 5,
				page: 1,
				offset: 0,
				total: apiData.length,
			});
		}
	}, [apiData]);
	useEffect(() => {
		setMaxPages(getMaxPages(paginationData.limit, paginationData.total));
	}, [paginationData]);
	useEffect(() => {
		if (apiData?.length) {
			setApiList(
				apiData.slice(
					paginationData.offset,
					paginationData.offset + paginationData.limit
				)
			);
		}
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
				<div className="pagination">
					<div>
						<button onClick={() => paginationHandler(paginationActions.FIRST)}>
							{'<<'}
						</button>
						<button onClick={() => paginationHandler(paginationActions.PREV)}>
							{'<'}
						</button>
					</div>
					<div>
						<h5>
							Page <b>{paginationData.page}</b> of <b>{maxPages}</b>
						</h5>
					</div>
					<div>
						<h5>Go to page:</h5>
						<input
							data-input="number"
							type="number"
							value={paginationData.page}
							max={maxPages}
							onChange={(e) =>
								paginationHandler(paginationActions.GOTO, {
									pageNumber: e.target.value,
								})
							}
						></input>
					</div>
					<div>
						<button onClick={() => paginationHandler(paginationActions.NEXT)}>
							{'>'}
						</button>
						<button onClick={() => paginationHandler(paginationActions.LAST)}>
							{'>>'}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DataTable;

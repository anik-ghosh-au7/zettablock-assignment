export const formatDateStr = (str) => {
	return str.split('T')[0].split('-').reverse().join('/');
};

export const getMaxPages = (pagination) => {
	const { limit, total } = pagination;
	if (total > 1) {
		return total % limit === 0
			? total / limit
			: parseInt(`${total / limit}`) + 1;
	} else return 1;
};

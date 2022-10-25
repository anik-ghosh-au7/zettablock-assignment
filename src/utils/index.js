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

const fallbackCopyTextToClipboard = (text) => {
	const textArea = document.createElement('textarea');

	textArea.value = text;
	textArea.style.top = '0';
	textArea.style.left = '0';
	textArea.style.position = 'fixed';

	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();

	try {
		const successful = document.execCommand('copy');
		const msg = successful ? 'successful' : 'unsuccessful';
		console.log('Fallback: Copying text command was ' + msg);
	} catch (err) {
		console.error('Fallback: Oops, unable to copy', err);
	}
	document.body.removeChild(textArea);
};

export const copyTextToClipboard = async (text) => {
	if (!navigator.clipboard) {
		fallbackCopyTextToClipboard(text);
		return;
	}
	try {
		navigator.clipboard.writeText(text);
	} catch (err) {
		throw err;
	}
};

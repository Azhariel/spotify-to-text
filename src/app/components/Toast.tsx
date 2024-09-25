import { useEffect } from 'react';

export default function Toast({
	message,
	visible,
	onClose,
}: {
	message: string;
	visible: boolean;
	onClose: () => void;
}) {
	useEffect(() => {
		if (visible) {
			const timer = setTimeout(onClose, 3000);
			return () => clearTimeout(timer);
		}
	}, [visible, onClose]);

	return (
		<div
			className={`fixed top-4 left-1/2 transform -translate-x-1/2 text-gray-800 py-2 px-4 rounded-lg shadow-lg transition-opacity duration-300 
                ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                ${message.includes('Failed') ? 'bg-red-500' : 'bg-green-500'}`}
		>
			{message}
		</div>
	);
}

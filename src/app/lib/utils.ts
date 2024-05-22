import FileResizer from 'react-image-file-resizer';
import { Score } from './definitions';

export const resizeFile = (file: File, width: number, height: number) =>
	new Promise((resolve, reject) => {
		try {
			FileResizer.imageFileResizer(
				file,
				width,
				height,
				'webp',
				80,
				0,
				(uri) => {
					resolve(uri);
				},
				'file'
			);
		} catch (error) {
			reject(error);
		}
	});

export const calcTotalScore = (scores: Score[]) =>
	scores.reduce((acc, score) => acc + score.score, 0);

export const formatDate = (dateString: string): string => {
	const date = new Date(dateString);
	const day = date.getDate().toString().padStart(2, '0');
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const year = date.getFullYear();
	return `${day}/${month}/${year}`;
};

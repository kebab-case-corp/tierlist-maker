import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import 'react-toastify/dist/ReactToastify.min.css';
import Header from './components/header';
import { ToastContainer } from 'react-toastify';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Tierlist Maker',
	description: 'Generated by create next app',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='fr' className='dark'>
			<body className={`${inter.className}`}>
				<Header />
				{children}
				<ToastContainer autoClose={3000} />
			</body>
		</html>
	);
}

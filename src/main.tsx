import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'rsuite/dist/rsuite.min.css';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeContextProvider } from './contexts/theme.context';
import './styles/globals.scss';
import './styles/tailwind.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<ChakraProvider>
			<ThemeContextProvider>
				<BrowserRouter>
					<AuthProvider>
						<App />
					</AuthProvider>
				</BrowserRouter>
			</ThemeContextProvider>
		</ChakraProvider>
	</React.StrictMode>
);

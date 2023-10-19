import {
	isPermissionGranted,
	requestPermission,
	sendNotification,
} from '@tauri-apps/api/notification';
// @ts-ignore
import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { redirect, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { axiosClient } from '../utils/axiosInstance';

interface User {
	id: string;
	roles: string[];
	fname: string;
	lname: string;
	email: string;
	phone: string;
}

interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	token: string | null;
	loading: boolean;
}
interface AuthProviderProps {
	children: React.ReactNode;
}
type AuthAction =
	| { type: 'SET_USER'; payload: { user: User | null; token: string } }
	| { type: 'LOGOUT' };

interface AuthContextType extends AuthState {
	login: (email: string, password: string) => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialState: AuthState = {
	user: null,
	isAuthenticated: false,
	token: null,
	loading: true,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
	switch (action.type) {
		case 'SET_USER':
			return {
				...state,
				user: action.payload.user,
				isAuthenticated: true,
				token: action.payload.token,
				loading: false,
			};
		case 'LOGOUT':
			return {
				...state,
				user: null,
				isAuthenticated: false,
				token: null,
				loading: false,
			};
		default:
			return state;
	}
};

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const navigate = useNavigate();
	const [state, dispatch] = useReducer(authReducer, initialState);

	const login = async (email: string, password: string) => {
		try {
			const response = await axiosClient.post(
				'/auth/login',
				{ email, password },
				{
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);

			const { success, access_token, message, ...userData } =
				response.data;

			if (success && access_token) {
				dispatch({
					type: 'SET_USER',
					payload: { user: userData as User, token: access_token },
				});
				// Save the token to local storage or cookies if needed
				await localStorage.setItem(
					'token',
					response.data?.access_token
				);
				// localStorage.setItem('userId', res.data?.);
				await localStorage.setItem(
					'token_expire',
					response.data.token_expires
				);
				await localStorage.setItem(
					'user',
					JSON.stringify(response.data)
				);
				await localStorage.setItem('role', response.data.roles);
				let permissionGranted = await isPermissionGranted();
				if (!permissionGranted) {
					const permission = await requestPermission();
					permissionGranted = permission === 'granted';
				}
				if (permissionGranted) {
					sendNotification({
						title: 'DIP',
						body: 'User logged in successfully!',
					});
				}
				// send to routes
				if (response.data?.roles.includes('director')) {
					navigate('/director');
					// console.log('go director');
				} else if (response.data?.roles.includes('hod')) {
					navigate('/hod');
					// console.log('go hod');
				} else {
					navigate('/scientist');
					// console.log('go scientist');
				}
			} else {
				// Handle authentication failure
				console.log(message);
			}
		} catch (error: any) {
			// Handle network errors
			console.log(error);
			toast.error(`Error: ${error.response?.data?.message}`, {
				position: 'bottom-right',
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: 'dark',
			});
			// console.log(error.response);
			toast.error(
				`Error: ${
					// @ts-ignore
					error
				}`,
				{
					position: 'bottom-right',
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: 'dark',
				}
			);
		}
	};

	const logout = async () => {
		// Remove token from local storage or cookies
		dispatch({ type: 'LOGOUT' });
		await localStorage.clear();
		redirect('/');
	};

	useEffect(() => {
		// Check for stored token during component mount
		const userl = localStorage.getItem('user');
		const storedToken = localStorage.getItem('token');
		if (storedToken) {
			const user = userl !== null ? JSON.parse(userl) : null;
			// You might want to validate the token here
			// and refresh it if necessary
			dispatch({
				type: 'SET_USER',
				payload: { user: user, token: storedToken },
			});
		} else {
			dispatch({ type: 'LOGOUT' });
		}
	}, []);

	return (
		<AuthContext.Provider value={{ ...state, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};

export { AuthProvider, useAuth };

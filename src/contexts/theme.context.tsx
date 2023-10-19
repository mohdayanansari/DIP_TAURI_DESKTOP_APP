import React, {
	Dispatch,
	SetStateAction,
	createContext,
	useContext,
	// useReducer,
	useState,
} from 'react';

interface ContextProps {
	themeMode: boolean;
	setThemeMode: Dispatch<SetStateAction<boolean>>;
}

export const ThemeContext = createContext<ContextProps>({
	themeMode: false,
	setThemeMode: (): boolean => false,
});

// ********Context Provider**************

export const ThemeContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	// const [state, dispatch] = useReducer(reducer, initialState);
	const [themeMode, setThemeMode] = useState<boolean>(true);

	return (
		<ThemeContext.Provider value={{ themeMode, setThemeMode }}>
			{children}
		</ThemeContext.Provider>
	);
};

// make use of this context provider
export const useThemeContext = () => useContext(ThemeContext);

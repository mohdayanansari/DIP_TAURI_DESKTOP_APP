// @ts-ignore
import { Navigate, Route, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AccessDenied from '../pages/AccessDenied';
import { ROLE } from '../utils/roles';

const PrivateRoute = ({
	children,
	roles,
}: {
	children: JSX.Element;
	roles: Array<ROLE>;
}) => {
	let location = useLocation();
	// @ts-ignore
	const { user, isAuthenticated, login, logout, loading } = useAuth();

	if (loading) {
		return <p className='container'>Checking auth..</p>;
	}

	const userHasRequiredRole =
		user && roles.some((role) => user.roles.includes(role));

	if (!isAuthenticated) {
		return <Navigate to='/' state={{ from: location }} />;
	}

	if (isAuthenticated && !userHasRequiredRole) {
		return <AccessDenied />; // build your won access denied page (sth like 404)
	}

	return children;
};

export default PrivateRoute;

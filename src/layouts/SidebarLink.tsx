import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
	LinkName,
	SidebarIconWrapper,
	StyledLink,
} from './UserComponents.Styled';

const SidebarLink = ({
	link,
	name,
	themeMode,
	children,
}: {
	link: string;
	name: string;
	themeMode: boolean;
	children: React.ReactNode;
}) => {
	const location = useLocation();
	return (
		<Link to={link}>
			<StyledLink
				active={location.pathname === link}
				themeMode={themeMode}
			>
				<SidebarIconWrapper>{children}</SidebarIconWrapper>
				<LinkName>{name}</LinkName>
			</StyledLink>
		</Link>
	);
};

export default SidebarLink;

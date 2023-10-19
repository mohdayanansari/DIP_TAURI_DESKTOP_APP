import styled from 'styled-components';
import { COLORS } from '../constants/COLORS';

interface LinkType {
	active: boolean;
	themeMode: boolean;
}

// profile section

// Side bar link components
export const StyledLink = styled.a<LinkType>`
	display: flex;
	align-items: center;
	padding-left: 20px;
	padding-right: 20px;
	gap: 5px;
	position: relative;
	background-color: ${(props) =>
		props.active
			? props.themeMode
				? '#4d69ff'
				: COLORS.dark[600]
			: props.themeMode
			? '#fff'
			: COLORS.dark[800]};
	height: 60px;
	border-radius: 12px;
	font-size: 16px;
	transition: all 0.3s;
	color: ${(props) =>
		props.active
			? props.themeMode
				? '#fff'
				: COLORS.light[400]
			: props.themeMode
			? '#BFBFBF'
			: '#88837E'};
	box-shadow: ${(props) =>
		props.active
			? `rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset`
			: 'none'};
	&:hover {
		background-color: ${(props) => (props.active ? '' : COLORS.dark[600])};
	}
`;
export const SidebarIconWrapper = styled.div``;
export const LinkName = styled.div``;

import { Outlet } from 'react-router-dom';
import Header from './Header';

import HODSidebar from './HODSidebar';

const HODLayout = () => {
	return (
		<main>
			<Header />
			<section className='flex w-full'>
				<HODSidebar />
				<section className='w-full min-h-[calc(100vh-120px)] overflow-y-auto'>
					<Outlet />
				</section>
			</section>
		</main>
	);
};

export default HODLayout;

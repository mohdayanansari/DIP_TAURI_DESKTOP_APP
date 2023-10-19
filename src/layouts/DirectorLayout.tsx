import { Outlet } from 'react-router-dom';
import DirectorSidebar from './DirectorSidebar';
import Header from './Header';

const DirectorLayout = () => {
	return (
		<main>
			<Header />
			<section className='flex w-full'>
				<DirectorSidebar />
				<section className='w-full min-h-[calc(100vh-120px)] overflow-y-auto'>
					<Outlet />
				</section>
			</section>
		</main>
	);
};

export default DirectorLayout;

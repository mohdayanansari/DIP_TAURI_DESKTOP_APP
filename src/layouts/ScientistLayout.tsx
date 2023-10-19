import { Outlet } from 'react-router-dom';
import Header from './Header';
import ScientistSidebar from './ScientistSidebar';

const ScientistLayout = () => {
	return (
		<main>
			<Header />
			<section className='flex w-full'>
				<ScientistSidebar />
				<section className='w-full min-h-[calc(100vh-120px)] overflow-y-auto'>
					<Outlet />
				</section>
			</section>
		</main>
	);
};

export default ScientistLayout;

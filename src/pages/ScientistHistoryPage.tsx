import ScientistArchiveTableClient from '../components/ScientistArchiveTableClient';

const ScientistHistoryPage = () => {
	return (
		<section>
			<h1 className='p-2 pl-4'>Filled Data</h1>
			<hr />

			<ScientistArchiveTableClient />
		</section>
	);
};

export default ScientistHistoryPage;

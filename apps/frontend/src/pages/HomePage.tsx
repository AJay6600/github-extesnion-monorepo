import { useAppData } from '../contexts/AppContext';

const HomePage = () => {
  const { selectedRepo, commitResponse } = useAppData();
  return (
    <div>
      <h1>selected Repo : {selectedRepo?.name}</h1>
      <h1>commits counts : {commitResponse?.length}</h1>
    </div>
  );
};

export default HomePage;

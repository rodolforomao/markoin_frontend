import { Outlet, useOutlet } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';
import Menubar from './Menubar';
// import ProjectCatalog from './ProjectCatalog';
import UsersList from './UsersList';
import TopBar from './TopBar';
import type { Theme } from '../../utils';


interface Props {
  theme: Theme;
  toggleTheme: () => void;
}

const HomeUsers = (props: Props) => {
  const outlet = useOutlet();

  return (
    <>
      <TopBar {...props} />
      <UsersList />
    </>
  );
};

export default HomeUsers;

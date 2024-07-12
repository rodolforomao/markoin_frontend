import { Outlet, useOutlet } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';
import Menubar from './Menubar';
// import ProjectCatalog from './ProjectCatalog';
import OrdersList from './OrdersList';
import TopBar from './TopBar';
import type { Theme } from '../../utils';


interface Props {
  theme: Theme;
  toggleTheme: () => void;
}

const HomeOrders = (props: Props) => {
  const outlet = useOutlet();

  return (
    <>
      <TopBar {...props} />
      <OrdersList />
    </>
  );
};

export default HomeOrders;

import { Outlet, useOutlet } from 'react-router-dom';
import Sidebar from '../../../Kanban/components/home/TopBar';
import type { Theme } from '../../utils';
import ReportImr from './ReportImr'


interface Props {
    theme: Theme;
    toggleTheme: () => void;
}

const Home = (props: Props) => {
    const outlet = useOutlet();

    return (
        <>
            <Sidebar {...props} />
            {outlet ? (
                <>
                    <main className='mt-[55px] z-10 w-100 overflow-auto bg-c-1 bg-center' style={{ height: "inherit", scrollbarColor: "#fff6 #00000026", scrollbarWidth: "auto" }}>
                        <Outlet />
                    </main>
                </>
            ) : (
                <ReportImr />
            )
            }
        </>
    );
};

export default Home;

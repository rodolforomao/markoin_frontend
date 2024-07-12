import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Theme } from './utils';
import Sidebar from './Sidebar';
import './assets/css/menu.css';
import { selectPermissionKanban } from './Kanban/api/endpoints/permissionKanban.endpoint';

interface Props {
  theme: Theme;
  toggleTheme: () => void;
}

const Menu = (props: Props) => {

  return (
    <>


      <Sidebar {...props} />
      <main className='w-[100%] overflow-hidden'>
        <nav className='h-[100%]'>
          <ul className='flex justify-center my-auto h-[100%] items-center '>
            <Link to='../users'>
              <li className='p-20 duration-[200ms] hover:text-white ease-linear hover:bg-[rgb(255,255,255,0.2)] rounded' title='Usuários'>
                <i className='bi bi-person-circle' style={{ fontSize: '3rem' }}></i>
                <p className='content-center text-center'>USUÁRIOS<br></br></p>
              </li>
            </Link>
            <Link to='../reports'>
              <li className='p-20 duration-[200ms] hover:text-white ease-linear hover:bg-[rgb(255,255,255,0.2)] rounded' title='IMR'>
                <i className='bi bi-file-earmark-text' style={{ fontSize: '3rem' }}></i>
                <p className='content-center text-center'>RELATÓRIO</p>
              </li>
            </Link>
          </ul>
        </nav>
      </main>


    </>
  );
};

export default Menu;

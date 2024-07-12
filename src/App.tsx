import { BrowserRouter as BR, Navigate, Route as R, Routes } from 'react-router-dom';
import { lazy, Suspense as S, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { getTheme } from './utils';
import Welcome from './Kanban/components/auth/Welcome';
import Home from './Kanban/components/home/Home';
import HomeUsers from './Kanban/components/home/HomeUsers';
import HomeOrders from './Kanban/components/home/HomeOrders';



import HomeImr from './Imr/components/homeImr/HomeImr'
import { Toaster } from 'react-hot-toast';
import Menu from './Menu';

const Setting = lazy(() => import('./Kanban/components/project/Setting'));
const Project = lazy(() => import('./Kanban/components/project/Project'));
const Adios = lazy(() => import('./Kanban/components/auth/Adios'));

function App() {
  const [theme, setTheme] = useState(getTheme());

  const toggleTheme = () => setTheme(({ mode }) => ({ mode: mode === 'light' ? 'dark' : 'light' }));

  return (
    <main className={`justify-center bg-c-1 flex min-h-[100vh] ${theme.mode === 'light' ? 'light-theme' : 'dark-theme'}`}>
      <Provider store={store}>
        <BR>
          <Routes>
            <R path='/menu' element={<Menu theme={theme} toggleTheme={toggleTheme} />} />
            <R path='/reports' element={<HomeOrders theme={theme} toggleTheme={toggleTheme} />}></R>
            <R path='/users' element={<HomeUsers theme={theme} toggleTheme={toggleTheme} />}>
              <R
                path=':projectId'
                element={
                  <S>
                    <Setting />
                  </S>
                }
              />
              <R
                path=':projectId/board'
                element={
                  <S>
                    <Project />
                  </S>
                }
              />
            </R>

            <R path='/register' element={<Welcome type='REGISTER' />} />
            <R path='/login' element={<Welcome type='LOGIN' />} />
            <R
              path='/adios'
              element={
                <S>
                  <Adios />
                </S>
              }
            />
            <R path='/' element={<Navigate to='/login' />} />
          </Routes>
        </BR>
      </Provider>
      <Toaster />
    </main>
  );
}

export default App;

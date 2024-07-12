import { lazy, Suspense as S, useState, useRef, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuthUserQuery } from './Kanban/api/endpoints/auth.endpoint';
import Avatar from './Kanban/components/util/Avatar';
import { setTheme, Theme } from './utils'
import { APIERROR } from './Kanban/api/apiTypes';
import './Kanban/assets/css/style.css'
import { MdOutlineWbSunny } from "react-icons/md";
import { FaRegMoon } from "react-icons/fa";

const Profile = lazy(() => import('./Kanban/components/home/Profile'));

interface Props {
    theme: Theme;
    toggleTheme: () => void;
}

function Sidebar(props: Props) {
    const { theme: { mode }, toggleTheme } = props;
    const { data: u, error } = useAuthUserQuery();
    const [showProfile, setShowProfile] = useState(false);
    const navigate = useNavigate();
    const profileRef = useRef(null);

    const handleToggle = () => {
        toggleTheme();
        setTheme(mode);
    };

    const handleAvatarClick = () => {
        setShowProfile(!showProfile);
    };

    const handleClickOutsideProfile = (event: MouseEvent) => {
        const target = event.target as Node;
        const profileElement = profileRef.current as HTMLElement | null;

        if (profileElement && !profileElement.contains(target)) {
            setShowProfile(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutsideProfile);
        return () => {
            document.removeEventListener('mousedown', handleClickOutsideProfile);
        };
    }, []);

    if (error && (error as APIERROR).status === 401) return <Navigate to='/login' />;

    return (
        <div className='barra_de_nav w-screen z-[100] flex h-[55px] items-center'>
            <div className='ml-[20px] flex items-center'>
                <button title='Ínicio' onClick={() => navigate('/menu')} className='img_sima'>
                    <img src='\assets\img\bitcoin-btc-logo.svg' width='35px' alt='sim-dnit' />
                </button>
                <button className="area_de_trabalho" onClick={() => navigate('/users')}> <span>Usuários</span></button>
                <button className="recentes" > <span>Relatório</span> </button>
            </div>
            <div style={{ position: 'absolute', right: 0, display: 'flex', paddingRight: '20px' }}>
                <button onClick={handleToggle} style={{ paddingTop: '0' }}>
                    {mode == 'dark' ? (
                        <MdOutlineWbSunny style={{ color: 'white' }} />
                    ) : (
                        <FaRegMoon style={{ color: 'white' }} />
                    )}
                </button>

                {u && (
                    <>
                        <Avatar
                            title='Perfil'
                            src={u.profileUrl}
                            name={u.username}
                            onClick={handleAvatarClick}
                            className='h-10 w-10 border-[4px] hover:border-green-500 m-auto ml-[8px!important]'
                            style={{}}
                        />
                    </>
                )}
            </div>
            {
                u && showProfile && (
                    <S>
                        <div ref={profileRef}>
                            <Profile authUser={u} />
                        </div>
                    </S>
                )
            }
        </div>
    );
}

export default Sidebar;
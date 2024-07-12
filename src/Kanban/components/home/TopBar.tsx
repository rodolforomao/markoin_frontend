import { lazy, Suspense as S, useState, useRef, useEffect } from 'react';
import CreateDesktopModel from '../desktop/CreateDesktopModel';
import CreateProjectModel from './CreateProjectModel';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuthUserQuery } from '../../api/endpoints/auth.endpoint';
import Avatar from '../util/Avatar';
import { setTheme, Theme } from '../../utils';
import { APIERROR } from '../../api/apiTypes';
import '../../assets/css/style.css';
import { MdOutlineWbSunny } from "react-icons/md";
import { FaRegMoon } from "react-icons/fa";
import { Icon } from '@iconify/react';
import { useSearchIssuesQuery } from '../../api/endpoints/issues.endpoint';
import SearchResultsModal from './SearchResultsModel';

// Importe o tipo SearchResult
import { SearchResult } from '../../api/apiTypes';

import { getUrlCompleteBackend } from '../../../utils/getUrl';

const Profile = lazy(() => import('./Profile'));

interface Props {
  theme: Theme;
  toggleTheme: () => void;
}

function TopBar(props: Props) {
  const { theme: { mode }, toggleTheme } = props;
  const { data: u, error } = useAuthUserQuery();
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const [isOpenCreateDesktopBoard, setIsOpenCreateDesktopBoard] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [issueAllQuery, setIssueAllQuery] = useState('');

  const { data: searchResults, refetch: refetchSearch } = useSearchIssuesQuery(
    { query: issueAllQuery },
    { skip: !issueAllQuery }
  );

  const searchResultsFormatted: SearchResult[] = Array.isArray(searchResults)
    ? searchResults.map((issue) => ({
      issueId: issue.issueId,
      projectId: issue.projectId,
      summary: issue.summary,
      listName: issue.listName,
      projectName: issue.projectName,
    }))
    : [];

  const handleToggle = () => {
    toggleTheme();
    setTheme(mode);
  };

  const handleAvatarClick = () => {
    setShowProfile(!showProfile);
  };

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setIsOpenCreateDesktopBoard(false);
  };

  const handleClickOutsideProfile = (event: MouseEvent) => {
    const target = event.target as Node;
    const profileElement = profileRef.current as HTMLElement | null;

    if (profileElement && !profileElement.contains(target)) {
      setShowProfile(false);
    }
  };
  useEffect(() => {
    if (searchQuery.length > 3) {
      const handler = setTimeout(() => {
        setIssueAllQuery(searchQuery);
      }, 1000);

      return () => {
        clearTimeout(handler);
      };
    }
  }, [searchQuery]);

  useEffect(() => {
    if (issueAllQuery) {
      refetchSearch();
    }
  }, [issueAllQuery, refetchSearch]);

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
        <button className="area_de_trabalho" onClick={() => navigate('/reports')}> <span>Relatório</span></button>

      </div>
      <div className='mt-8 flex' style={{ position: "absolute", left: "75%", bottom: "15%" }}>
        <button onClick={() => setIsOpenCreateDesktopBoard(!isOpenCreateDesktopBoard)} className='btn btn_acao mr-4 h-8' style={{ fontSize: "10px", right: "100%", fontSizeAdjust: "10px", bottom: "1%", position: "absolute" }}>
          Criar
        </button>
        <div className='relative'>
          <input
            placeholder='Pesquisar'
            className='w-44 rounded-sm border-2 bg py-[5px] pl-9 pr-2 text-sm outline-none focus:border-chakra-blue'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Icon
            width={20}
            icon='ant-design:search-outlined'
            className='absolute top-[6px] left-2 w-[19px]'
          />
        </div>
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
              src={getUrlCompleteBackend(u)}
              name={u.username}
              onClick={handleAvatarClick}
              className='h-10 w-10 border-[4px] hover:border-green-500 m-auto ml-[8px!important]'
              style={{}}
            />
          </>
        )}
      </div>
      {searchResults && searchQuery.trim() !== '' && (
        <SearchResultsModal
          results={searchResultsFormatted}
          onClose={() => setSearchQuery('')}
        />
      )}
      {
        isOpenCreateDesktopBoard && (
          <div className='modelOptionCreate' >
            <ul className='ulOptionCreate'>
              <li className='criar_area_de_trabalho'>
                <button onClick={() => handleOptionClick('desktop')} className='btn btn-primary criar_area' style={{ fontSize: '12px' }}>
                  Criar Área de Trabalho
                </button>
              </li>
              <li className='criar_area_quadro'>
                <button onClick={() => handleOptionClick('project')} className='btn btn-primary criar_quadro' style={{ fontSize: '12px' }}>
                  Criar Quadro
                </button>
              </li>
            </ul>
          </div>
        )
      }

      {
        selectedOption === 'desktop' && (
          <CreateDesktopModel onClose={() => setSelectedOption(null)} />
        )
      }

      {
        selectedOption === 'project' && (
          <CreateProjectModel onClose={() => setSelectedOption(null)} />
        )
      }
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

export default TopBar;
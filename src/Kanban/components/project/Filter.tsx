import { Dispatch, lazy, SetStateAction, Suspense as S, useState } from 'react';
import { APIERROR } from '../../api/apiTypes';
import { Navigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useMembersQuery, useMembersPerBoardQuery } from '../../api/endpoints/member.endpoint';
import { useAuthUserQuery } from '../../api/endpoints/auth.endpoint';
import { useProjectQuery } from '../../api/endpoints/project.endpoint';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setIssueQuery } from '../../store/slices/querySlice';
import { getUrlCompleteBackend } from '../../../utils/getUrl';
import Avatar from '../util/Avatar';
import toast from 'react-hot-toast';
const IssueModelHOC = lazy(() => import('../issue/IssueModelHOC'));
const CreateIssueModal = lazy(() => import('../issue/CreateIssueModal'));

interface Props {
  setIsDragDisabled: Dispatch<SetStateAction<boolean>>;
  projectId: number;
  isAdmin: boolean;
  isEmpty: boolean;
  filter: string;
  setFilter: Dispatch<SetStateAction<string>>;
}

function Filter(props: Props) {
  const { projectId, isEmpty, isAdmin, setIsDragDisabled, filter, setFilter } = props;
  const { data: members, error } = useMembersQuery(projectId);
  const { data: membersPerBoard } = useMembersPerBoardQuery(projectId);
  const { data: project } = useProjectQuery(projectId);
  const { data: user } = useAuthUserQuery();
  const { userId: currentUserId } = useAppSelector((state) => state.query.issue);
  const [on, setOn] = useState(false);
  const dispatch = useAppDispatch();
  const [fold, setFold] = useState(true);
  const memberCount = members?.length;
  const membersPerBoardCount = membersPerBoard?.length;

  if (error && (error as APIERROR).status === 401) return <Navigate to='/login' />;

  function handleClick() {
    if (isEmpty) return toast.error('Crie uma lista primeiro!');
    setOn(true);
  }

  const handleSetQuery = (query: { userId?: number }) => () => {
        dispatch(setIssueQuery(query));
    setIsDragDisabled(!!query.userId);
  };

  const handleClearFilter = () => {
    handleSetQuery({})();
    setFold(true);
  };

  return (
    <div className='mb-8 flex min-w-fit items-center text-c-5 justify-content-between'>
      <div className='flex items-center'>
        <div className={`ml-2 relative ${fold ? '' : 'hidden'}`}>
          <input
            placeholder='Buscar Cartão'
            className='w-44 rounded-sm border-[1.5px] bg-transparent py-[5px] pl-9 pr-2 text-sm outline-none focus:border-chakra-blue'
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <Icon
            width={20}
            icon='ant-design:search-outlined'
            className='absolute top-[6px] left-2 w-[19px]'
          />
        </div>
        {membersPerBoard && membersPerBoardCount && (
          <div className={`p-2 ml-2 mr-1 flex ${!fold ? 'overflow-auto max-w-[30vw]' : ''}`}>
            {membersPerBoard
              .slice() 
              .sort((a, b) => a.username.localeCompare(b.username))
              .slice(0, fold ? 4 : membersPerBoard.length)
              .map(({ u, username, id }, index) => (
                <Avatar
                  key={id}
                  src={getUrlCompleteBackend(u)}
                  name={username}
                  style={{ zIndex: membersPerBoardCount- index }}
                  onClick={handleSetQuery({ userId: id })}
                  className={`-ml-2 h-11 w-11 border-2 duration-300 hover:-translate-y-2 ${id === currentUserId ? 'border-blue-500' : ''}`}
                />
              ))}
            {membersPerBoardCount > 4 && fold && (
              <button
                onClick={() => setFold(false)}
                className='-ml-2 grid h-11 w-11 items-center rounded-full bg-c-2 pl-2 hover:bg-c-3'
                >
                {membersPerBoardCount - 4}+
              </button>
            )}
            </div>
        )}
        {user && (
          <button className='btn-crystal shrink-0' onClick={handleSetQuery({ userId: user.id })}>
            Meus cartões
          </button>
        )}
        {(currentUserId || !fold) &&  (
          <>
            <div className='pb-[2px]'>|</div>
            <button className='btn-crystal shrink-0' onClick={handleClearFilter}>
              Resetar Filtro
            </button>
          </>
        )}
        </div>

      <button onClick={handleClick} className='btn peer relative mx-5 shrink-0'>
        Criar Cartão
      </button>
      {on && !isEmpty && (
        <S>
          <IssueModelHOC children={CreateIssueModal} onClose={() => setOn(false)} />
        </S>
      )}
    </div>
  );
}

export default Filter;

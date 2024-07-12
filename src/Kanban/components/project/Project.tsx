import { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useIssuesQuery, useIssuesPartialQuery } from '../../api/endpoints/issues.endpoint';
import { useListsQuery } from '../../api/endpoints/lists.endpoint';
import type { APIERROR } from '../../api/apiTypes';
import Board from './Board';
import Filter from './Filter';
import SS from '../util/SpinningCircle';
import { useAppSelector } from '../../store/hooks';
import type { Member } from '../../types/Member';
import type { User } from '../../../types/User';
import { selectMembers } from '../../api/endpoints/member.endpoint';
import { selectAuthUser } from '../../api/endpoints/auth.endpoint';
import { selectCurrentProject } from '../../api/endpoints/project.endpoint';
import { IsAdmin } from '../controlUserKanban/ProfileKanban';
import type { Issues } from '../../api/apiTypes';

const Project = () => {
  const projectId = Number(useParams().projectId);
  const issueQuery = useAppSelector((state) => state.query.issue);
  const { data: lists, error: listError } = useListsQuery(projectId);
  const [isDragDisabled, setIsDragDisabled] = useState(false);
  const { project } = selectCurrentProject(projectId);
  const isAdmin = IsAdmin(projectId); // Verifica profile Admin
  const { members } = selectMembers(projectId);
  const { authUser: u } = selectAuthUser();
  const [scrolled, setScrolled] = useState(false);

  const { data: issues, error: issueError } = useIssuesQuery(
    { projectId, ...issueQuery },
    { refetchOnMountOrArgChange: true }
  );

  const { data: issuesPartial, error: issuePartialError } = useIssuesPartialQuery(
    { projectId, ...issueQuery },
    { refetchOnMountOrArgChange: true }
  );

  // State for filter criteria
  const [filter, setFilter] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setScrolled(scrollTop > 0);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!members || !u || !project) return null;

  if (listError && issueError) {
    if ((listError as APIERROR).status === 401 || (issueError as APIERROR).status === 401)
      return <Navigate to='/login' />;
    return (
      <div className='grid h-full grow place-items-center text-xl'>
        Você não faz parte deste quadro!
      </div>
    );
  }

  const filteredIssues: Issues = issuesPartial
  ? Object.fromEntries(
      Object.entries(issuesPartial).map(([key, value]) => [
        key,
        value.filter(issue => issue.summary.toLowerCase().includes(filter.toLowerCase()))
      ])
    )
  : {};

  return (
    <div className='mt-[4rem] flex grow flex-col px-8 sm:px-10'>
      <div className={`fixed bg-[var(--c-1)] z-[99] w-[-webkit-fill-available] px-4 ${scrolled ? 'border-b border-solid border-grey shadow-[2px_15px_20px_-15px_rgba(0,0,0,0.3)]' : ''}`}>
        <h1 className='mb-2 text-xl font-semibold text-c-text'>{project?.name}</h1>
        <Filter projectId={projectId} setIsDragDisabled={setIsDragDisabled} setFilter={setFilter}  isAdmin={isAdmin} isEmpty={lists?.length === 0} filter={filter} />
      </div>
      {lists ? (
        <Board lists={lists} issues={filteredIssues} isDragDisabled={isDragDisabled} isAdmin={isAdmin} />
      ) : (
        <div className='grid h-[40vh] w-full place-items-center'>
          <SS />
        </div>
      )}
      
    </div>
  );
};

export default Project;

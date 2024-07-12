import { lazy, Suspense as S, useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import DraggableWrapper from '../dnd/DraggableWrapper';
import { AuthUser } from '../../api/apiTypes';
import { types, priorities } from '../../utils';
import { selectMembers } from '../../api/endpoints/member.endpoint';
import { useAuthUserQuery } from '../../api/endpoints/auth.endpoint';
import AssignedMembers from './AssignedMembers';
import BadgeElement from '../util/BadgeElement';

import { Issue as IssueType } from '../../types/Issue';
const IssueModelHOC = lazy(() => import('./IssueModelHOC'));
const IssueDetailModal = lazy(() => import('./IssueDetailModal'));

interface Props {
  isAdmin?: boolean;
  issue: IssueType;
}

const Issue = (props: Props) => {
  const { listId, listIdx, idx, summary, id, type, priority, assignees, comments, isDragDisabled, isAdmin, listBadge, issue } =
    props;
  const [isOpen, setIsOpen] = useState(false);
  const projectId = Number(useParams().projectId);
  const { members } = selectMembers(projectId);
  const { data: u } = useAuthUserQuery();
  const { icon, text } = priorities[priority];
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const idIssueSearch = Number(queryParams.get('idIssueSearch'));

  useEffect(() => {
    if (idIssueSearch && idIssueSearch === id) {
      setIsOpen(true);
    }
  }, [idIssueSearch]);

  if (!members || !u) return null;

  let classColorCard = selectClass(assignees, u);

  return (
    <>
      <DraggableWrapper
        className={classColorCard}
        index={idx}
        draggableId={'issue-' + id}
        isDragDisabled={isDragDisabled}
      >
        <BadgeElement index={idx.toString()} listBadge={listBadge} />
        <div onClick={() => setIsOpen(true)}>
          <span className=''>{summary}</span>
          <div className='mt-[10px] flex items-center justify-between'>
            <div className='mb-1 flex items-center gap-3'>
              <img className='h-[18px] w-[18px]' src={icon} alt={text} />
              {comments > 0 && (
                <span className='block w-6 rounded-md bg-c-2 text-center text-[13px]'>
                  {comments}
                </span>
              )}
            </div>
            <AssignedMembers assignees={assignees} members={members} issue={issue} />
          </div>
        </div>

      </DraggableWrapper>
      {isOpen && (
        <S>
          <IssueModelHOC
            children={IssueDetailModal}
            issue={issue}
            onClose={() => setIsOpen(false)}
            control={{ listId, listIdx, idx, isAdmin }}
          />
        </S>
      )
      }
    </>
  );
};

function selectClass(assignees: { userId: any; }[], u: AuthUser) {
  let classColorCard = "hover:bg-c-4 mb-2 w-full rounded-lg p-2 shadow-issue bg-c-1 overflow-anywhere";
  if (assignees && u) {
    assignees.forEach((person: { userId: any; }) => {
      if (person.userId === u.id) {
        classColorCard = "hover:bg-c-4 mb-2 w-full rounded-lg p-2 shadow-issue bg-c-7 overflow-anywhere";
        return;
      }
    });
  }
  return classColorCard;
}

export default Issue;

interface Props extends IssueType {
  listId: number;
  listIdx: number;
  idx: number;
  isDragDisabled: boolean;
}

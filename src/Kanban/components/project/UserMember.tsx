import { Icon } from '@iconify/react';
import toast from 'react-hot-toast';
import { PublicUser } from '../../api/apiTypes';
import { useAddMemberMutation } from '../../api/endpoints/member.endpoint';
import Avatar from '../util/Avatar';
import { Issue as IssueType } from '../../types/Issue';

interface Props extends PublicUser {
  added: boolean;
  projectId: number;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  issue?: IssueType;
  desktopId: number;
}

const UserMember = (props: Props) => {
  const { id, username, email, profileUrl, added, projectId, desktopId, setInput, issue } = props;
  const [addMember] = useAddMemberMutation();

  const handleAddMember = async () => {
    if (added) return;
    await addMember({ userId: id, projectId, desktopId });
    toast(username + ' faz parte deste do quadro!');
    setInput('');
  };

  return (
    <div
      onClick={handleAddMember}
      className={`mb-1 flex items-center rounded-sm bg-c-2 px-3 py-2 text-c-text hover:bg-c-6  ${
        added ? 'pointer-events-none' : 'cursor-pointer'
      }`}
    >
      <Avatar src={profileUrl} name={username} issue={issue} />
      <span className='mx-3'>{username}</span>
      <span className='ml-auto overflow-hidden truncate text-sm font-medium'>{email}</span>
      {added && <Icon className='ml-3' icon='teenyicons:tick-circle-outline' />}
    </div>
  );
};

export default UserMember;

import { ChangeEvent, lazy, memo, Suspense as S, useEffect, useState } from 'react';
import { useRemoveMemberMutation } from '../../api/endpoints/member.endpoint';
import { PublicUser } from '../../api/apiTypes';
import type { Member } from '../../types/Member';
import UserMember from './UserMember';
import axiosDf from '../../api/axios';
import Table from 'react-bootstrap/Table';
import { useListProfilesKanbanQuery, useUpdatePermissionKanbanMutation } from '../../api/endpoints/permissionKanban.endpoint';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import BasicNotify from '../util/Notify';
import Project from './Project';

const ConfirmModel = lazy(() => import('../util/ConfirmModel'));

interface Props {
  members: Member[];
  projectId: number;
  isAdmin?: boolean;
  isGestorKanban?: boolean;
  desktopId: number;


}

let unsubscribe: ReturnType<typeof setTimeout>;

const MemberInput = (props: Props) => {
  const { projectId, members, isAdmin, isGestorKanban, desktopId } = props;
  const [removeMember] = useRemoveMemberMutation();
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const uname = members && members[selectedIdx as number]?.username;
  const allListProfilesKanbanQueryResult = useListProfilesKanbanQuery();
  const allListProfilesKanban = allListProfilesKanbanQueryResult.data;
  const [addPermissionKanbanMutation] = useUpdatePermissionKanbanMutation();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showSucessUpdateProfile, setShowSucessUpdateProfile] = useState(false);

  const handleRemoveMember = async () => {
    
    if (selectedIdx === null || selectedIdx === undefined || !members) return;
    const member = members[selectedIdx];
    removeMember({ projectId: projectId, memberId: member.id, userId: member.userId, desktopId: desktopId});
    setSelectedIdx(null);
    setIsOpen(false);
    const success = true;
    if (success) {
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 3000);
    }
  };

  const handleUpdateProfileUserKanban = async (newProfileId: number, projectId: number, userId: number) => {
    try {
      await addPermissionKanbanMutation({
        userId, profileId: Number(newProfileId), projectId,
        profileKanban: undefined
      });
      setShowSucessUpdateProfile(true);
      setTimeout(() => {
        setShowSucessUpdateProfile(false);
      }, 3000);

    } catch (error) {
      console.error('Erro ao alterar perfil:', error);
    }
  };


  return (
    <div style={{ width: '100vh' }}>
      <div className='relative'>
        <div>
          <div className='mt-3 flex flex-wrap gap-x-1 gap-y-2'>
            
            {members ? (
              <>

                <table className='table-bordered table-striped table-hover w-100 custom-table' style={{ background: 'var(--c-0)' }}>
                  <thead>
                    <tr >
                      <th className='py-2' style={{ color: 'var(--c-5)' }}>Usuário</th>
                      <th style={{ color: 'var(--c-5)' }}>Email</th>
                      <th style={{ color: 'var(--c-5)' }}>Perfil</th>
                      <th style={{ color: 'var(--c-5)' }}>Ação</th>
                    </tr>
                  </thead>
                  <tbody style={{ width: '50px' }}>
                    {members.map(({ username, userId, email, infoProfileUserKanban }, idx) => (
                      <tr key={userId}>
                        <td key={userId} style={{ color: 'var(--c-5)' }}>{username}</td>
                        <td style={{ color: 'var(--c-5)' }}>{email}</td>
                        <td style={{ color: 'var(--c-0)' }}>
                          <select
                            className={`bg-zinc-300 ml-2 rounded-lg w-[10rem] ${(!isAdmin || isGestorKanban) && (isAdmin || !isGestorKanban) ? 'cursor-not-allowed opacity-50' : ''}`}
                            disabled={(!isAdmin || isGestorKanban) && (isAdmin || !isGestorKanban)}
                            value={infoProfileUserKanban[0]?.profileKanban.id || ""}
                            onChange={(e) => handleUpdateProfileUserKanban(Number(e.target.value), projectId, userId)}
                          >
                            {infoProfileUserKanban.length === 0 && (
                              <option value="" disabled >
                                Selecione um perfil
                              </option>
                            )}
                            {allListProfilesKanban?.map(profile => (
                              profile.id === 1 || profile.id === 2 ? (
                                <option
                                  key={profile.id}
                                  value={profile.id}
                                  disabled
                                >
                                  {profile.nameProfile}
                                </option>
                              ) : <option
                                key={profile.id}
                                value={profile.id}
                              >
                                {profile.nameProfile}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className='py-2'>
                          <>
                            <button
                              className={`bg-zinc-300 ml-2  rounded-lg w-[10rem] ${(!isAdmin || isGestorKanban) && (isAdmin || !isGestorKanban) ? 'cursor-not-allowed opacity-50' : ''}`}
                              onClick={() => {
                                setIsOpen(true);
                                setSelectedIdx(idx);
                              }}
                              disabled={(!isAdmin || isGestorKanban) && (isAdmin || !isGestorKanban)}
                            >
                              <span className='text-sm/[17px]'>Remover</span>
                            </button>
                          </>
                        </td>
                      </tr>
                    ))}

                  </tbody>
                </table>
              </>
            ) : (
              'loading ...'
            )}
          </div>
        </div>
        {!input ? null : (
          <div className='absolute top-0 z-10 w-full rounded-[3px] border-[1px] bg-c-1 bg-white p-[8px_12px_22px] text-c-text shadow-sm'>
            {loading ? (
              <span className='mt-2 block text-center'>Buscando ...</span>
            ) : users.length === 0 ? (
              <span className='mt-2 block text-center'>Nenhum usuário encontrado </span>
            ) : (
              <>
                <span className='mb-2 block text-sm'>É este?</span>
                {users.map((info) => (
                  <UserMember
                    key={info.id}
                    projectId={projectId}
                    desktopId={desktopId}
                    setInput={setInput}
                    added={members?.some(({ userId }) => userId === info.id) ?? false}
                    {...info}
                  />
                ))}
              </>
            )}
          </div>
        )}
      </div>
      {
        isOpen && (
          <S>
            <ConfirmModel
              msg={'remover ' + uname}
              onClose={() => setIsOpen(false)}
              onSubmit={handleRemoveMember}
              toastMsg={uname + ' está fora do quadro!'}
            />
          </S>
        )
      }
      {
        isOpen && desktopId == 1 && (
          <S>
            <ConfirmModel
              msg={'remover ' + uname +  ' de toda a área de trabalho'}
              onClose={() => setIsOpen(false)}
              onSubmit={handleRemoveMember}
              toastMsg={uname + ' está fora do quadro!'}
            />
          </S>
        )
      }
      {
        showSucessUpdateProfile && (
          < BasicNotify msg='Perfil Alterado' />
        )
      }
    </div >
  );
};

export default memo(MemberInput);

const searchUsers = async (q: string) => {
  const result = await axiosDf.get('api/user/search?q=' + q);
  return result.data;
};


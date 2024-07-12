import { lazy, memo, Suspense as S, useState } from 'react';
import { Link } from 'react-router-dom';
import type { AuthUser } from '../../api/apiTypes';
import UpdateProfile from './UpdateProfile';
import Avatar from '../util/Avatar';
import { parseDate } from '../../utils';
import IconBtn from '../util/IconBtn';
import axiosDf from '../../api/axios';
import toast from 'react-hot-toast';
import { Navigate, useNavigate } from 'react-router-dom';

import { Issue as IssueType } from '../../types/Issue';

import { DiAptana } from "react-icons/di";
import { IoMdKey } from "react-icons/io";

import { getUrlCompleteBackend } from '../../../utils/getUrl';

const ChangePwd = lazy(() => import('./ChangePwd'));

interface Props {
  authUser: AuthUser;
  issue?: IssueType;
  }

const Profile = (props: Props) => {
  const { authUser: u, issue } = props;
  const [isNormal, setIsNormal] = useState(true);
  const [mostrarConteudo, setMostrarConteudo] = useState(true);
  const [perfilUser, setPerfilUser] = useState(false);
  const [updatePwd, setUpdatePwd] = useState(false);

  const navigate = useNavigate();

  const handleLogOut = async () => {
    await logOut();
    toast('Deslogado!');
    navigate('/login');
  };

  const handlePerfil = () => {
    setMostrarConteudo(false);
    setPerfilUser(true);
    setUpdatePwd(false);

  };

  const handleUpdatePwd = () => {
    setMostrarConteudo(false);
    setPerfilUser(false);
    setUpdatePwd(true);
  };
  

  return (
    <div className="fixed top-8 right-0 h-27 w-23 flex bg-opacity-50 z-50" style={{marginTop: '28px', paddingRight:'12px'}}>
      <div className={`flex flex-col ${perfilUser || updatePwd ? 'h-100' : 'h-60'} w-60 gap-3 overflow-y-auto overflow-x-hidden relative rounded-lg`} style={{ borderRadius: '5px', boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.2)', background: 'var(--c-8)'}}>
        {u ? (
          <>
            {mostrarConteudo && (
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop:'8px'}}>
              <Avatar
                  src={getUrlCompleteBackend(u)}
                  name={u.username}
                  className="h-20 w-20 cursor-default text-1xl"
                  issue={issue}
              />
              <div style={{fontSize: '14px', paddingTop: '6px', paddingBottom:'5px'}}>
                  <span style={{fontWeight: '700', color:'var(--c-5)'}}>{u.username.split(' ')[0]} </span>
              </div>
              <div style={{fontSize: '14px'}}>
                  <span style={{color:'var(--c-5)'}}>{u.email}</span>
              </div>
          </div>
            )}
        {mostrarConteudo && (
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <div style={{display: 'flex', justifyContent: 'center'}}>
                <button style={{background: '#665a5a52', borderRadius: '50%', width: '30px', height:'30px', marginRight: '10px'}} onClick={handlePerfil}>
                  <DiAptana style={{fontSize: '20px', marginLeft:'5px', color:'var(--c-5)'}} />
                </button>
                <button style={{background: '#665a5a52', borderRadius: '50%', width: '30px', height:'30px',  marginRight: '10px'}} onClick={handleUpdatePwd}>
                  <IoMdKey style={{fontSize: '20px', marginLeft:'5px', color:'var(--c-5)'}} />
                </button>
              </div>
              <IconBtn onClick={handleLogOut} icon="charm:sign-out" title="Sair" />
            </div>
          )}
            {perfilUser && (
              <UpdateProfile user={u} />
            )}
            {updatePwd && (
              <ChangePwd />
            )}
          </>
        ) : null}
      </div>
    </div>
  );
};

export default memo(Profile);

async function logOut() {
  const result = await axiosDf.post('auth/logout');
  return result.data;
}
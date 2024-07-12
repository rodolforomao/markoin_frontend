import React from 'react';
import type { User } from '../../types/User';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faUnlock, faEdit, faTrash, faKey } from '@fortawesome/free-solid-svg-icons';

import { useSelectUsersQuery } from '../../api/endpoints/auth.endpoint';

import '../../css/UsersList.css'

// Componente `UsersList`
const UsersList: React.FC = () => {

  const { data: listUsers, error } = useSelectUsersQuery();

  const handleEditUser = (userId: number) => {
    // Lógica para edição do usuário
    console.log(`Editar usuário com ID ${userId}`);
  };

  const handleBlockUser = (userId: number) => {
    // Lógica para bloqueio do usuário
    console.log(`Bloquear usuário com ID ${userId}`);
  };

  const handleUnblockUser = (userId: number) => {
    // Lógica para desbloqueio do usuário
    console.log(`Desbloquear usuário com ID ${userId}`);
  };

  const handleRemoveUser = (userId: number) => {
    // Lógica para remoção do usuário
    console.log(`Remover usuário com ID ${userId}`);
  };

  const handleResetPassword = (userId: number) => {
    // Lógica para resetar a senha do usuário
    console.log(`Resetar senha do usuário com ID ${userId}`);
  };

  return (
    <div className="container">
      <h1 className="mt-12">User List</h1>
      <div className="row">
        <div className="col-md-12">
          <table style={{ border: '1px solid #ddd', borderCollapse: 'collapse', width: '100%' }}>
            <thead style={{ backgroundColor: '#f2f2f2' }}>
              <tr>
                <th style={{ minWidth: '50px' }}>ID</th>
                <th style={{ minWidth: '150px' }}>Username</th>
                <th style={{ minWidth: '200px' }}>Email</th>
                <th style={{ minWidth: '250px' }}>Profile URL</th>
                <th style={{ minWidth: '200px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {listUsers && listUsers.map(user => (
                <tr key={user.id}>
                  <td style={{ maxWidth: '100px', wordBreak: 'break-word' }}>{user.id}</td>
                  <td style={{ maxWidth: '200px', wordBreak: 'break-word' }}>{user.username}</td>
                  <td style={{ maxWidth: '250px', wordBreak: 'break-word' }}>{user.email}</td>
                  <td style={{ maxWidth: '300px', wordBreak: 'break-word' }}>{user.profileUrl}</td>
                  <td style={{ minWidth: '150px' }}>
                    <button onClick={() => handleEditUser(user.id)} className="btn btn-primary btn-sm mr-1">
                      <FontAwesomeIcon icon={faEdit} className="mr-1" /> 
                    </button>
                    {user.isBlocked ? (
                      <button onClick={() => handleUnblockUser(user.id)} className="btn btn-warning btn-sm mr-1">
                        <FontAwesomeIcon icon={faUnlock} className="mr-1" /> 
                      </button>
                    ) : (
                      <button onClick={() => handleBlockUser(user.id)} className="btn btn-danger btn-sm mr-1">
                        <FontAwesomeIcon icon={faLock} className="mr-1" /> 
                      </button>
                    )}
                    <button onClick={() => handleResetPassword(user.id)} className="btn btn-info btn-sm mr-1">
                      <FontAwesomeIcon icon={faKey} className="mr-1" /> 
                    </button>
                    <button onClick={() => handleRemoveUser(user.id)} className="btn btn-danger btn-sm">
                      <FontAwesomeIcon icon={faTrash} className="mr-1" /> 
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersList;

import { PropsOf } from '@emotion/react';
import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { selectCurrentDesktop, useDesktopsQuery } from '../../api/endpoints/desktop.endpoint';
import { selectAuthUser } from '../../api/endpoints/auth.endpoint';
import axiosDf from '../../api/axios';
import { PublicUser } from '../../api/apiTypes';
import type { Member } from '../../types/Member';
import Button from 'react-bootstrap/Button';
import { useAddMemberMutation } from '../../api/endpoints/member.endpoint';
import Notify from '../util/Notify'


interface Props {
    desktopId: number;
    project: String;
    members: Member[];
    projectId: number;
    isAdmin?: boolean;
    isGestorKanban?: boolean;
}


const SelectAddMember = (props: Props) => {
    const [userData, setUserData] = useState<PublicUser[]>([]);
    const { desktopId, project, members, projectId, isAdmin, isGestorKanban } = props;
    const { authUser } = selectAuthUser();
    const { data: desktop } = useDesktopsQuery(authUser?.id as number, { skip: !authUser });
    const { desktop: data } = selectCurrentDesktop(desktopId);
    const [selectedUser, setSelectedUser] = useState<number | undefined>();
    const [selectedProject, setSelectProject] = useState<number | undefined>();
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    

    let desktopWithId2;

    if (desktop) {
        desktopWithId2 = desktop.find(desktop => desktop.id === desktopId);
    }


    const handleSelectUser = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedUser(parseInt(event.target.value));
    };

    const handleSelectProject = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectProject(parseInt(event.target.value));
    };

    const handleSelectClick = async () => {
        const userDataResponse = await getUserAll();
        setUserData(userDataResponse);
    }

    const filteredUserData = userData.filter(user => !members?.some(member => member.userId === user.id));
    const [addMember] = useAddMemberMutation();

    const handleAddMember = async () => {
        if (selectedUser !== undefined) {
            await addMember({ userId: selectedUser, projectId: selectedProject, desktopId: desktopId });
            setSelectedUser(undefined);
            const success = true;
            if (success) {
                setShowSuccessAlert(true);
                setTimeout(() => {
                    setShowSuccessAlert(false);
                }, 3000);
            }
        } else {
            console.error("Não foi possível adicionar o membro.");
        }

    
    };

    return (
        
        <div style={{ display: 'flex', width: '100%' }}>
            <Form.Select style={{ width: '300px', marginRight: ' 10px' }} disabled>
                <option>{data?.nameDesktop}</option>
            </Form.Select>
            {desktopId !== 1 && (
            <Form.Select onChange={handleSelectProject} style={{ width: '300px', marginRight: ' 10px' }} disabled={(!isAdmin || isGestorKanban) && (isAdmin || !isGestorKanban)}>
                <option value="">Selecione</option>
                    <option key={projectId} value={projectId}>{project}</option>
            </Form.Select>
            )}
            <Form.Select style={{ width: '300px', marginRight: ' 10px' }} onClick={handleSelectClick} onChange={handleSelectUser} disabled={(!isAdmin || isGestorKanban) && (isAdmin || !isGestorKanban)}
            >
                <option value="">Selecione</option>
                {filteredUserData.map(user => (
                    <option key={user.id} value={user.id}>
                        {user.email}
                    </option>
                ))}
            </Form.Select>
            <div className="d-grid gap-2">
                <Button variant="primary" size="sm" onClick={handleAddMember}>
                    Salvar
                </Button>
                {showSuccessAlert && (
                    <Notify msg={'Usuario adicionado com sucesso'} />
                )}
            </div>
        </div>
    );
};

export default SelectAddMember;

const getUserAll = async () => {
    const result = await axiosDf.get('api/user/getUserAll');
    return result.data;
};

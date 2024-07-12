//Profiles
// 1	Administrador
// 2	Gestor Kanban
// 3	Gestor Empresa
// 4	Servidor DNIT
// 5	Servidor Coordenador
// 6	Usuario Kanban

import { selectPermissionKanban } from '../../api/endpoints/permissionKanban.endpoint';
import { selectCurrentProject } from '../../api/endpoints/project.endpoint';

export const IsAdmin = (projectId: number) => {
    const { permissionKanban } = selectPermissionKanban();
    const { project } = selectCurrentProject(projectId);

    let isAdmin = false;

    if (project && permissionKanban && permissionKanban.length > 0) {
        for (let i = 0; i < permissionKanban.length; i++) {
            const permission = permissionKanban[i];
            if (permission.profileId === 1 && (permission.projectId === projectId || permission.desktopId === project.desktopId)) {
                isAdmin = true;

                break;
            }
        }
    }
    return isAdmin
}

export const IsGestorKanban = (projectId: number) => {
    const { permissionKanban } = selectPermissionKanban();
    const { project } = selectCurrentProject(projectId);

    let isGestorKanban = false;

    if (project && permissionKanban && permissionKanban.length > 0) {
        for (let i = 0; i < permissionKanban.length; i++) {
            const permission = permissionKanban[i];
            if (permission.profileId === 2 && (permission.projectId === projectId || permission.desktopId === project.desktopId)) {
                isGestorKanban = true;

                break;
            }
        }
    }
    return isGestorKanban
}

export const RecoverUserProfile = (projectId: number) => {
    const { permissionKanban } = selectPermissionKanban();
    const { project } = selectCurrentProject(projectId);

    let profileUser;

    if (project && permissionKanban && permissionKanban.length > 0) {
        for (let i = 0; i < permissionKanban.length; i++) {
            const permission = permissionKanban[i];
            if ((permission.projectId === projectId || permission.desktopId === project.desktopId)) {
                profileUser = permission.profileKanban;

                break;
            }
        }
    }
    return profileUser
}
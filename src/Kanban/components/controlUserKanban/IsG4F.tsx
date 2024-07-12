// No arquivo project.endpoint.ts
import { selectCurrentProject } from "../../api/endpoints/project.endpoint";

export const getProjectIds = async () => {
    return [1, 2, 3, 4, 5, 6];
};

export const isG4F = (projectId: number | undefined) => {
    if (!projectId) { return false }

    const desktop = selectCurrentProject(projectId);

    if (desktop && desktop.project && desktop.project.desktopId === 1) {
        return true;
    } else {
        return false;
    }
};

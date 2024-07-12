import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useDesktopsQuery } from '../../api/endpoints/desktop.endpoint';
import { selectAuthUser } from '../../api/endpoints/auth.endpoint';
import { useProjectQuery } from '../../api/endpoints/project.endpoint';
import { useMoveIssueMutation } from '../../api/endpoints/issues.endpoint'; // Importe a função useMoveIssueMutation
import { canMoveCard } from '../controlUserKanban/RulesCardG4F';
import toast from 'react-hot-toast';

interface List {
    id: number;
    name: string;
}

interface Project {
    id: number;
    name: string;
    lists: List[];
}

interface ModalMoveProps {
    isOpen: boolean;
    closeModal: () => void;
    userId: string | number | undefined;
    issueId?: number;
    listId?: string | number | undefined;
    projectId: number;
    profileUser: number;
}

const ModalMove: React.FC<ModalMoveProps> = ({ isOpen, closeModal, profileUser, issueId, listId, projectId }) => {
    const [selectedDesktopId, setSelectedDesktopId] = useState<number | null>(null);
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
    const [selectedListId, setSelectedListId] = useState<number | null>(null);
    const { authUser } = selectAuthUser();
    const { data, isLoading, isError } = useDesktopsQuery(authUser?.id as number, { skip: !authUser });
    const [moveIssue] = useMoveIssueMutation();

    useEffect(() => {
        if (data && data.length > 0 && listId) {
            let foundProject: Project | undefined;
            let foundList: List | undefined;
            let foundDesktopId: number | null = null;

            for (const desktop of data) {
                const project = desktop.projects.find(project => project && project.id === projectId && project.lists?.some(list => list.name === listId));
                if (project) {
                    foundDesktopId = desktop.id;
                    foundList = project.lists?.find(list => list.name === listId);
                    if (foundList) {
                        setSelectedDesktopId(desktop.id);
                        setSelectedProjectId(project.id);
                        setSelectedListId(foundList.id);
                        break;
                    }
                }

            }

            if (!foundList) {
                setSelectedDesktopId(foundDesktopId);
                setSelectedProjectId(null);
                setSelectedListId(null);
            }
        }
    }, [data, listId]);

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error fetching data</div>;

    if (!isOpen || !data) return null;

    const handleProjectChange = (projectId: number) => {
        setSelectedProjectId(projectId);
        setSelectedListId(null);
    };

    const handleMoveButtonClick = async () => {
        try {
            if (issueId && selectedListId && selectedProjectId) {
                const selectedListFromBlock = data.flatMap((desktop) =>
                    desktop.projects
                        .filter(project => project.id === selectedProjectId || project.id === projectId)
                        .flatMap((project) =>
                            project.lists !== undefined && project.lists.length > 0
                                ? project.lists.filter(list => list.name === listId)
                                : []
                        )
                )[0];

                let fromBlock = selectedListFromBlock.id;

                const selectedListToBlock = data.flatMap((desktop) =>
                    desktop.projects
                        .filter(project => project.id === selectedProjectId)
                        .flatMap((project) =>
                            project.lists !== undefined && project.lists.length > 0
                                ? project.lists.filter(list => list.id === selectedListId)
                                : []
                        )
                )[0];

                let toBlock = selectedListToBlock.id;

                const lists: { id: number; name: string; }[] = data.flatMap((desktop) =>
                    desktop.projects
                        .filter(project => project.id === selectedProjectId)
                        .flatMap(project => project.lists || [])
                );

                if (canMoveCard(String(fromBlock), String(toBlock), profileUser, lists)) {
                    await moveIssue({ issueId, newOrder: toBlock, projectId: selectedProjectId, listId: fromBlock });
                    closeModal(); // Feche o modal após mover a issue com sucesso
                } else {
                    toast.error("Você não tem permissão para mover o cartão para este bloco.");
                    return;
                }

            }
        } catch (error) {
            console.error('Erro ao mover a issue:', error);
        }
    };

    return (
        <div className="modal" style={{ background: 'var(--c-2)', left: "65%", top: "21%", borderRadius: "1em", padding: "15px", width: "25%", display: "flex", height: "25%", boxShadow: 'rgb(0,0,0,0.4) 4px 4px 20px' }}>
            <div className="modal-content border-none" style={{ background: 'var(--c-2)' }}>
                <header className="modal-card-head">
                    <p className="modal-card-title" style={{ textAlign: "center", color: 'var(--c-5)' }}>Mover Cartão
                        <button onClick={closeModal} title='Close' className='btn-icon ml-4 text-lg' style={{ fontSize: "15px", position: "relative", left: "30%", color: 'var(--c-5)' }}>
                            <Icon icon='akar-icons:cross' />
                        </button>
                    </p>
                </header>
                <div className='form-grid' style={{ padding: "2%" }}>
                    <div className="form-grid-child form-grid-child-full hide">
                        <label className="label" style={{ color: 'var(--c-5)' }}>Quadro</label>
                        <div className="control">
                            <div className="select">
                                <select
                                    value={selectedProjectId || ''}
                                    onChange={(e) => {
                                        const projectId = parseInt(e.target.value);
                                        handleProjectChange(projectId);

                                    }}
                                    style={{ fontSize: "1em", width: "86%", background: 'var(--c-3)', color: 'var(--c-5)' }}
                                >
                                    <option value="">Selecione um Quadro</option>
                                    {data.map((desktop) => (
                                        <optgroup key={desktop.id} label={desktop.nameDesktop}>
                                            {desktop.projects.map((project) => (
                                                <option key={project.id} value={project.id}>{project.name}</option>
                                            ))}
                                        </optgroup>
                                    ))}
                                </select>

                            </div>
                        </div>
                    </div>
                </div>
                <div className='form-grid' style={{ padding: "2%", width: '80%' }}>
                    <div className="form-grid-child form-grid-child-full hide" >
                        <div className="control" >
                            <label className="label" style={{ color: 'var(--c-5)' }}>Lista</label>
                            <div className="select">
                                <select
                                    value={selectedListId !== null ? selectedListId.toString() : ''}
                                    onChange={(e) => setSelectedListId(parseInt(e.target.value))}
                                    style={{ fontSize: "1em", width: "96%", background: 'var(--c-3)', color: 'var(--c-5)' }}
                                >
                                    <option value="">Selecione um Quadro</option>
                                    {selectedProjectId &&
                                        data.flatMap((desktop) =>
                                            desktop.projects
                                                .filter(project => project.id === selectedProjectId)
                                                .flatMap((project) =>
                                                    project.lists !== undefined && project.lists.length > 0 ?  // Check if project.lists is not undefined
                                                        project.lists.map((list) => (
                                                            <option key={list.id} value={list.id}>
                                                                {list.name}
                                                            </option>
                                                        )) :
                                                        <option key="no-list" value="" disabled>
                                                            Não há lista
                                                        </option>
                                                )
                                        )
                                    }
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <button className='btn btn-primary' style={{ width: "50%", margin: "auto 0" }} onClick={handleMoveButtonClick} >Mover</button>
            </div>
        </div>
    );
};

export default ModalMove;

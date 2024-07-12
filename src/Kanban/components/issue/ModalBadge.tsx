import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import { useDesktopsQuery } from '../../api/endpoints/desktop.endpoint';
import { selectAuthUser } from '../../api/endpoints/auth.endpoint';
import { useBadgeIssueMutation } from '../../api/endpoints/issues.endpoint';

import { Issue as IssueType } from '../../types/Issue';
import type { IssueMetaData } from './IssueModelHOC';

interface List {
    id: number;
    name: string;
}

interface Project {
    id: number;
    name: string;
    lists: List[];
}

interface ModalBadgeProps {
    isOpen: boolean;
    closeModal: () => void;
    userId: string | number | undefined;
    issueId?: number;
    listId?: string | number;
    issue: IssueType;
}

const ModalBadge: React.FC<ModalBadgeProps> = ({ isOpen, closeModal, userId, issueId, listId, issue }) => {
    const [selectedBadgeIds, setSelectedBadgeIds] = useState<string[]>([]);
    const { authUser } = selectAuthUser();
    const { data, isLoading, isError } = useDesktopsQuery(authUser?.id as number, { skip: !authUser });

    const [badgeIssue] = useBadgeIssueMutation();

    useEffect(() => {
        
    }, [isOpen]);

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error fetching data</div>;

    if (!isOpen || !data) return null;

    const handleBadgeChanged = (badgeIssueId: string) => {
        if (!selectedBadgeIds.includes(badgeIssueId)) {
            setSelectedBadgeIds([...selectedBadgeIds, badgeIssueId]);
        } else {
            // Se já estiver, remove-o
            setSelectedBadgeIds(selectedBadgeIds.filter(id => id !== badgeIssueId));
        }
    };

    const handleButtonClick = async () => {
        try {
            if (issueId) {
                await badgeIssue({ issueId, listBadge: selectedBadgeIds });
                closeModal();
            }
        } catch (error) {
            console.error('Erro ao mover a issue:', error);
        }
    };

    const listaColors = getColorList();
    initializeBadge(selectedBadgeIds, setSelectedBadgeIds, issue)

    return (
        <div className="modal" style={{ background:'var(--c-2)', left: "65%", top: "21%", borderRadius: "1em", padding: "15px", width: "25%", display: "flex", height: "35%", boxShadow: 'rgb(0,0,0,0.4) 4px 4px 20px' }}>
            <div className="modal-content border-none" style={{background:'var(--c-2)'}}>
                <header className="modal-card-head">
                    <p className="modal-card-title" style={{ textAlign: "center", color:'var(--c-5)' }}>Etiquetar cartão
                        <button onClick={closeModal} title='Close' className='btn-icon ml-4 text-lg' style={{ fontSize: "15px", position: "relative", left: "30%", color:'var(--c-5)' }}>
                            <Icon icon='akar-icons:cross' />
                        </button>
                    </p>
                </header>
                <div className='form-grid' style={{ padding: "2%" }}>
                    <div className="form-grid-child form-grid-child-full hide">
                        <label className="label" style={{color:'var(--c-5)' }}>Cores</label>
                        <div className="control">
                            <div className="select" style={{color:'var(--c-5)' }}>

                                {listaColors.map((checkbox) => (
                                    <div key={checkbox.id}>
                                    <input
                                        type="checkbox"
                                        id={checkbox.id}
                                        checked={selectedBadgeIds.includes(checkbox.id)}
                                        onChange={() => handleBadgeChanged(checkbox.id)}
                                    />
                                    <label htmlFor={checkbox.id}>{checkbox.nickname}</label>
                                    </div>
                                ))}


                                {/* <select
                                    value={selectedBadgeId || ''}
                                    onChange={(e) => {
                                        const badgeIssueId = parseInt(e.target.value);
                                        handleBadgeChanged(badgeIssueId);
                                    }}
                                >
                                    <option value="">Selecione uma Cor</option>
                                    {listaColors.map((color: Color) => (
                                        <option key={color.id} value={color.id}>{color.nickname}</option>
                                    ))}
                                </select>  */}
                            </div>
                        </div>
                    </div>
                </div>
                <button className='btn btn-primary' style={{ width: "50%", margin: "auto 0" }} onClick={handleButtonClick}>Salvar</button>
            </div>
        </div>
    );
};

function initializeBadge(selectedBadgeIds: string[], setSelectedBadgeIds: React.Dispatch<React.SetStateAction<string[]>>, issue: IssueType) {
    if((selectedBadgeIds == null || selectedBadgeIds.length == 0) && issue.listBadge != '' && issue.listBadge != undefined) 
    {
        setSelectedBadgeIds(issue.listBadge.split(",").map(String))
    }
    
}

interface Color {
    id: string;
    name: string;
    nickname: string;
    html: React.ReactNode; // Alteração do tipo para React.ReactNode
}

const getColorList = (): Color[] => {
    const colors: Color[] = [
        { id: '0', name: 'Primary', nickname: 'Azul Escuro', html: <div className="badge bg-primary" style={{ width: '80%' }}></div> },
        { id: '1', name: 'Secondary', nickname: 'Cinza', html: <div className="badge bg-secondary" style={{ width: '80%' }}></div> },
        { id: '2', name: 'Success', nickname: 'Verde', html: <div className="badge bg-success" style={{ width: '80%' }}></div> },
        { id: '3', name: 'Danger', nickname: 'Vermelho', html: <div className="badge bg-danger" style={{ width: '80%' }}></div> },
        { id: '4', name: 'Warning', nickname: 'Amarelo', html: <div className="badge bg-warning" style={{ width: '80%' }}></div> },
        { id: '5', name: 'Info', nickname: 'Azul Claro', html: <div className="badge bg-info" style={{ width: '80%' }}></div> },
        { id: '6', name: 'Light', nickname: 'Branco', html: <div className="badge bg-light text-dark" style={{ width: '80%' }}></div> },
        { id: '7', name: 'Dark', nickname: 'Preto', html: <div className="badge bg-dark" style={{ width: '80%' }}></div> },
    ];
    return colors;
};

export default ModalBadge;

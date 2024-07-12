import React, { useState } from 'react';
import { MdAssessment } from 'react-icons/md';
import ModalAssessment from './ModalAssessment';
import ModalMove from './ModalMove'; // Importe o componente ModalMover
import ModalBadge from './ModalBadge';
import { Category } from '../util/DropDown';
import { FaArrowRight, FaIdBadge } from "react-icons/fa6";
import { RecoverUserProfile } from '../controlUserKanban/ProfileKanban';
import { VscRefresh } from "react-icons/vsc";
import { Issue as IssueType } from '../../types/Issue';
import {isG4F} from '../controlUserKanban/IsG4F'
import ModalReiniciarDemanda from './ModalReiniciarDemanda';


interface MenuIssueDetailProps {
    userId?: number; // Define userId as optional
    issueId?: number; // Define issueId as optional
    lists?: Category[];
    isAdmin?: boolean; // Adicionar prop isAdmin
    listId?: string | number;
    issue?: IssueType;
    projectId: number;
}

const MenuIssueDetail: React.FC<MenuIssueDetailProps> = ({ userId, issueId, lists, listId, issue, projectId }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalReiniciarOpen, setIsModalReiniciar] = useState(false);
    const [isMoverModalOpen, setIsMoverModalOpen] = useState(false); // Adicione o estado para o modal de mover
    const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
    const isdesktopG4F = isG4F(projectId);

    let profileUser = RecoverUserProfile(projectId);
    if (profileUser === undefined) {
        profileUser = -1;
    }

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const toggleModalReiniciar = () => {
        setIsModalReiniciar(!isModalReiniciarOpen);
    };

    const toggleMoverModal = () => {
        setIsMoverModalOpen(!isMoverModalOpen);
    };

    const toggleBadgeModal = () => {
        setIsBadgeModalOpen(!isBadgeModalOpen);
    };

    const shouldShowEvaluateButton = (profileUser && (profileUser.id === 4 || profileUser.id === 1)) && listId === 'DNIT REVISA';

    const shouldShowRestart = (
        isdesktopG4F &&
        profileUser &&
        (profileUser.id === 4 || profileUser.id === 1) &&
        !['BACKLOG', 'BLOCO DE ASSINATURA', 'CONCLUÍDO', 'SAÍDA'].includes(listId as string)
    );
    return (
        <>
            <div className="" style={{ top: "10%", position: "relative", textAlign: "left" }}>
                <h1 className="" style={{ fontSize: "14px", padding: "4%", color: 'var(--c-5)' }}>
                    Ações
                </h1>
                {shouldShowEvaluateButton && (
                    <div
                        style={{ display: "flex", alignItems: "center", backgroundColor: "#e4e6ea", cursor: "pointer" }}
                        onClick={toggleModal}>
                        <div style={{ padding: "2%", fontSize: "20px" }}>
                            <MdAssessment />
                        </div>
                        <span style={{ marginLeft: "10px" }}>Avaliar Demanda</span>
                    </div>
                )}
                {shouldShowRestart && (
                    <>
                        <div style={{ height: '4px' }}></div> {/* Use height para espaçamento vertical */}
                        <div
                            style={{ display: "flex", alignItems: "center", backgroundColor: '#e4e6ea', cursor: "pointer" }}
                            onClick={toggleModalReiniciar}>
                            <div style={{ padding: "2%", fontSize: "20px" }}>
                                <VscRefresh />
                            </div>
                            <span style={{ marginLeft: "10px" }}>Reiniciar Demanda</span>
                        </div>
                    </>
                )}

                <div style={{ padding: '4px' }}></div>

                <div
                    style={{ display: "flex", alignItems: "center", backgroundColor: "#e4e6ea", cursor: "pointer", background: 'var(--c-3)', color: 'var(--c-0)' }}
                    onClick={toggleMoverModal}>
                    <div style={{ padding: "2%", fontSize: "20px" }}>
                        <FaArrowRight />
                    </div>
                    <span style={{ marginLeft: "10px" }}>Mover</span>
                </div>

                <div style={{ padding: '4px' }}></div>
                <div
                    style={{ display: "flex", alignItems: "center", backgroundColor: "#e4e6ea", cursor: "pointer", background: 'var(--c-3)', color: 'var(--c-0)' }}
                    onClick={toggleBadgeModal}>
                    <div style={{ padding: "2%", fontSize: "20px" }}>
                        <FaIdBadge />
                    </div>
                    <span style={{ marginLeft: "10px" }}>Etiquetar</span>
                </div>                
            </div>

            {isMoverModalOpen && (
                <ModalMove isOpen={isMoverModalOpen} closeModal={toggleMoverModal} userId={userId} issueId={issueId} listId={listId} projectId={projectId} profileUser={profileUser.id} />
            )}
            {isBadgeModalOpen && issue && (
                <ModalBadge isOpen={isBadgeModalOpen} closeModal={toggleBadgeModal} userId={userId} issueId={issueId} listId={listId} issue={issue} />
            )}

            <ModalAssessment isOpen={isModalOpen} closeModal={toggleModal} userId={userId} issueId={issueId} lists={lists} />

            {isModalReiniciarOpen && (
                <ModalReiniciarDemanda isOpen={isModalReiniciarOpen} closeModal={toggleModalReiniciar} userId={userId} issueId={issueId} projectId={projectId} listId={issue?.listId}
                />
            )}

        </>
    );
};

export default MenuIssueDetail;

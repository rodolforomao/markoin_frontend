import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Button from 'react-bootstrap/Button';
import { useRestartIssueMutation } from '../../api/endpoints/issues.endpoint';
import Notify from '../util/Notify'




interface ModalReiniciar {
    isOpen: boolean;
    closeModal: () => void;
    userId?: number;
    issueId?: number;
    projectId?: number;
    listId?: number;
}

const ConfirmModelReiniciar: React.FC<ModalReiniciar> = ({ isOpen, closeModal, userId, issueId, projectId, listId }) => {

    const [reiniciaDemanda] = useRestartIssueMutation();
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    const ReiniciarDemanda = async () => {

        const body = { issueId, userId, listId }

        if (!body) return;
        await reiniciaDemanda({ id: issueId, body: { ...body, projectId: Number(projectId) } });
        const success = true;
        if (success) {
            setShowSuccessAlert(true);
            setTimeout(() => {
                setShowSuccessAlert(false);
            }, 5000);
        }
    };

    if (!isOpen || !issueId) return null;

    return (

        <div className="modal" style={{ background: 'var(--c-2)', left: "65%", top: "21%", borderRadius: "1em", padding: "15px", width: "13%", display: "flex", height: "22%", boxShadow: 'rgb(0,0,0,0.4) 4px 4px 20px' }}>
            <div className="modal-content border-none" style={{ background: 'var(--c-2)' }}>
                <header className="modal-card-head">
                    <p className="modal-card-title" style={{ textAlign: "center", fontWeight: '700', color: 'var(--c-5)' }}>Reiniciar Demanda</p>
                    <div className='py-4'>
                        <p style={{ textAlign: "center", color: 'var(--c-5)' }}>Você tem certeza que deseja reiniciar a demanda?</p>
                    </div>
                </header>
                <div className='form-grid' style={{ padding: "2%", textAlign: "center" }}>
                    <Button variant="secondary" onClick={ReiniciarDemanda} size="sm" style={{ width: "30%", margin: "auto 0", marginRight: '15px' }}>Salvar</Button>
                    <Button variant="secondary" onClick={closeModal} title='Close' size="sm" style={{ background: 'gray' }}>Cancelar</Button>
                </div>

                {showSuccessAlert && (
                    <Notify msg={'Demanda reiniciada com sucesso'} />
                )}


            </div>
        </div>

    );
};

export default ConfirmModelReiniciar;



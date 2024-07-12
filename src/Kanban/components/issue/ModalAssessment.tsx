import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axiosDF from '../../api/axios';
import DropDown, { Category } from '../util/DropDown';
import { Icon } from '@iconify/react';

interface ModalAssessmentProps {
    isOpen: boolean;
    closeModal: () => void;
    userId?: number;
    issueId?: number;
    lists?: Category[];
}

const ModalAssessment: React.FC<ModalAssessmentProps> = ({ isOpen, closeModal, userId, issueId, lists }) => {
    const [checkboxState, setCheckboxState] = useState({
        revisaoArgumento: false,
        revisaoForma: false,
    });
    const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number>(1); // Initial state set to 1

    useEffect(() => {
        if (lists && selectedCategoryIndex === null) {
            setSelectedCategoryIndex(1);
        }
    }, [lists, selectedCategoryIndex]);

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        setCheckboxState(prevState => ({
            ...prevState,
            [name]: checked
        }));
    };

    const handleReprovarClick = () => {
        if (checkboxState.revisaoArgumento || checkboxState.revisaoForma) {
            showConfirmationDialog();
        } else {
            toast.error("Por favor, selecione pelo menos uma opção antes de reprovar.");
        }
    };

    const showConfirmationDialog = () => {
        toast.promise(
            new Promise((resolve) => {
                const confirmed = window.confirm("Esta ação resultará em uma penalidade. Deseja continuar?");
                resolve(confirmed);
            }),
            {
                loading: 'Verificando...',
                success: (result) => {
                    if (result) {
                        reprovarDocumento();
                        return "Ação confirmada, documento reprovado com sucesso!";
                    } else {
                        return "Ação cancelada.";
                    }
                },
                error: 'Erro ao processar a ação.',
            }
        );
    };

    const reprovarDocumento = () => {
        if (!lists || selectedCategoryIndex === null) {
            toast.error("Por favor, selecione uma categoria antes de reprovar.");
            return;
        }

        const selectedCategory = lists[selectedCategoryIndex];
        if (!selectedCategory) {
            toast.error("Categoria selecionada inválida.");
            return;
        }

        const dataToSend = {
            revisaoArgumento: checkboxState.revisaoArgumento,
            revisaoForma: checkboxState.revisaoForma,
            userId: userId,
            issueId: issueId,
            category: selectedCategory.value // Inclua o valor da categoria em dataToSend
        };

        axiosDF.put('api/reviewTask/', dataToSend)
            .then(response => {
                // toast.success("Documento reprovado com sucesso!");
                window.location.reload();
            })
            .catch(error => {
                //  toast.error("Erro ao reprovar documento. Por favor, tente novamente.");
            });
    };


    if (!isOpen || !lists) return null;

    return (
        <div className="modal" style={{ backgroundColor: "var(--bs-body-bg)", position: "absolute", left: "65%", top: "21%", borderRadius: "1em", padding: "15px", width: "20%", display: "flex", height: "250px", boxShadow: 'rgb(0,0,0,0.4) 4px 4px 20px' }}>
            <div className="modal-content border-none">
                <h2 className='font-semibold'>Avaliação de Demanda</h2>
                <button onClick={closeModal} title='Close' className='btn-icon ml-4 text-lg' style={{ top: "-10%", left: "85%", position: "relative", color:'var(--c-5)' }}>
                    <Icon icon='akar-icons:cross' />
                </button>
                <div className='ml-2'>
                    <input type="checkbox" id="revisaoArgumento" name="revisaoArgumento" checked={checkboxState.revisaoArgumento} onChange={handleCheckboxChange} />
                    <label htmlFor="revisaoArgumento" style={{ padding: "8px" }}>Revisão argumento</label>
                </div>
                <div className='ml-2'>
                    <input type="checkbox" id="revisaoForma" name="revisaoForma" checked={checkboxState.revisaoForma} onChange={handleCheckboxChange} />
                    <label htmlFor="revisaoForma" style={{ padding: "8px" }}>Revisão forma</label>
                </div>
                <br />
                <div>
                    <div style={{ display: "none" }}>
                        <p>Mover para </p>
                        <div style={{ position: "relative", left: "2%", bottom: "1px" }}>
                            <select
                                value={selectedCategoryIndex || ''}
                                onChange={(e) => setSelectedCategoryIndex(parseInt(e.target.value))}
                                style={{ fontSize: "1em" }}
                            >
                                <option value="" disabled>Selecione a lista... </option>
                                {lists.map((category, index) => (
                                    <option key={index} value={index}>{category.text}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <br />
                </div>
                <button className='btn btn-primary' onClick={handleReprovarClick}>Reprovar</button>
            </div>
        </div>
    );
};

export default ModalAssessment;

import React, { useState, useEffect } from 'react';
import { useUpdatePeriodReferenceMutation } from '../../api/endpoints/issues.endpoint';
import toast from 'react-hot-toast';

interface Props {
    issueId: number;
    periodReference: string | undefined;
}

const PeriodReference = (props: Props) => {
    const { issueId, periodReference } = props;
    const [mesesReferencia, setMesesReferencia] = useState({ mesAtual: '', mesAnterior: '' });
    const [isWithinFirst5Weekdays, setIsWithinFirst5Weekdays] = useState(false);
    const [mesReferencia, setMesReferencia] = useState('');
    const [updateMonthReference] = useUpdatePeriodReferenceMutation();



    useEffect(() => {
        const currentDate = new Date();
        const formattedCurrentDate = `${String(currentDate.getMonth() + 1).padStart(2, '0')}/${currentDate.getFullYear()}`;

        currentDate.setMonth(currentDate.getMonth() - 1);
        const formattedPreviousDate = `${String(currentDate.getMonth() + 1).padStart(2, '0')}/${currentDate.getFullYear()}`;

        setMesesReferencia({
            mesAtual: formattedCurrentDate,
            mesAnterior: formattedPreviousDate
        });

        setMesReferencia(formattedCurrentDate);
    }, []);

    useEffect(() => {
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        let weekdaysCount = 0;

        for (let i = 0; i < 7; i++) {
            const currentDay = new Date(firstDayOfMonth);
            currentDay.setDate(firstDayOfMonth.getDate() + i);
            const dayOfWeek = currentDay.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Não conta sábados e domingos
                weekdaysCount++;
            }
            if (weekdaysCount === 5) {
                if (today <= currentDay) {
                    setIsWithinFirst5Weekdays(true);
                }
                break;
            }
        }
    }, []);

    const handleMonthReferenceChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedMonth = event.target.value;
        setMesReferencia(selectedMonth);
        // envia os dados para atualizar o mesReferencia backend
        await updateMonthReference({ issueId, selectedPeriodReference: selectedMonth });
        toast('Período de referência alterado!');
    };

    return (
        <>
            {isWithinFirst5Weekdays && (
                <div style={{ marginTop: "2%", marginLeft: "-1%" }}>
                    <label className="ml-3 color-c-5" htmlFor="mesReferencia">Selecione o período de Referência:</label>
                    <select
                        className="ml-4 p-2 bgcolor-c-1 color-c-5"
                        id="mesReferencia"
                        value={periodReference === null ? mesReferencia : periodReference}
                        onChange={handleMonthReferenceChange}
                    >
                        <option value={mesesReferencia.mesAtual}>{mesesReferencia.mesAtual}</option>
                        <option value={mesesReferencia.mesAnterior}>{mesesReferencia.mesAnterior}</option>
                    </select>
                </div>
            )}
        </>
    );
};

export default PeriodReference;

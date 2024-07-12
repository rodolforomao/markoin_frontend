import React from 'react';
import { useDesktopsQuery } from '../../api/endpoints/desktop.endpoint';

interface DesktopListProps {
    userId: number;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    selectedId?: number | null;
}

const DesktopList = ({ userId, selectedId, onChange }: DesktopListProps) => {
    // Utilize o hook useDesktopsQuery para buscar os desktops
    const { data, isLoading, isError } = useDesktopsQuery(userId);

    if (isLoading) {
        return <div>Carregando desktops...</div>;
    }

    if (isError || !data) {
        return <div>Ocorreu um erro ao buscar os desktops.</div>;
    }

    return (
        <div>
            <select 
                style={{ borderRadius: '5px', border: '1px solid black', width: '100%', background: 'var(--c-2)', color:'var(--c-5)' }} 
                onChange={onChange}
                value={selectedId ?? ""}
                >
                <option style={{color: 'var(--c-5)'}} value="">Selecione a Área de trabalho</option>
                {data.map((desktop) => (
                    <option style={{color: 'var(--c-5)'}} key={desktop.id} value={desktop.id}>
                        {desktop.nameDesktop}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default DesktopList;

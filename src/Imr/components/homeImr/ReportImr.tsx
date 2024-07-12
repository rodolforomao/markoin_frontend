import React, { useState, useEffect } from "react";
import { useGerarRelatorioImrQuery } from '../../api/endpoints/gerarRelatorioImr.endpoint';
import DownloadIMR from "./DownloadIMR";
import ListEmployeeImr from "./ListEmployeeImr";
import { Table } from "react-bootstrap";

const ReportIMR = () => {
    const [mesReferencia, setMesReferencia] = useState('');
    const { data, error, isLoading } = useGerarRelatorioImrQuery(mesReferencia);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Define o mês de referência para o mês anterior
        const currentDate = new Date();
        currentDate.setMonth(currentDate.getMonth() - 1);
        const formattedDate = currentDate.toISOString().slice(0, 7); // Formato: YYYY-MM
        setMesReferencia(formattedDate);
    }, []);

    const toggleListEmployeeScreen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div id='content' className='p-10 mt-3 flex w-full h-[100%] justify flex-col'>
            <div id='buttonListEmployee' style={{ margin: "2px" }}>
                <button className='btn btn-primary' onClick={toggleListEmployeeScreen}>
                    {isOpen ? 'Voltar ao Relatório' : 'Lista de Funcionários'}
                </button>
            </div>
            <div id='top-bar' className="p-1 my-10 flex items-center justify-between outline outline-1">
                <div>
                    <label className="ml-3 color-c-5" htmlFor="mesReferencia">Selecione o Mês de Referência:</label>
                    <input
                        className="ml-4 p-2 bgcolor-c-1 color-c-5"
                        type="month"
                        id="mesReferencia"
                        value={mesReferencia}
                        onChange={(e) => setMesReferencia(e.target.value)}
                    />
                </div>
                <DownloadIMR mesReferencia={mesReferencia} data={data} error={error} isLoading={isLoading} />
            </div>
            <div id='printDiv' className="printDiv p-[8px]">
                <img src='\assets\img\bitcoin-btc-logo.svg' width='35px' alt='sim-dnit' />
                <h1 className="pl-[8px]">Sistema Integrado de Monitoramento Avançado</h1>
            </div>
            {!isOpen ? (
                <div className='overflow-x-scroll'>
                    <div id='tableDiv' className='overflow-x-scroll'>

                        {data && (
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>AÇÃO</th>
                                        <th>NÚMERO DO PROCESSO OU DOCUMENTO SEI</th>
                                        <th>SUBATIVIDADE</th>
                                        <th>DATA DE INÍCIO</th>
                                        <th>DATA DA ENTREGA</th>
                                        <th>PRAZO MÁXIMO</th>
                                        <th>PRAZO MÁXIMO+EXTRAS</th>
                                        <th>DATA DE CONCLUSÃO DO PROCESSO</th>
                                        <th>LISTA</th>
                                        <th>NOTA REFERENTE AO PRAZO</th>
                                        <th>FORMA</th>
                                        <th>NOTA FORMA</th>
                                        <th>ARGUMENTO</th>
                                        <th>NOTA ARGUMENTO</th>
                                        <th>PESO</th>
                                        <th>NOTA PARCIAL</th>
                                        <th>RESPONSÁVEL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((rowData: any, rowIndex: number) => (
                                        <tr key={rowIndex}>
                                            <td className="text-center">{rowIndex + 1}</td>
                                            {Object.values(rowData).slice(1).map((value: any, cellIndex: number) => (
                                                <td className="text-center" key={cellIndex}>{value}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>

                            </Table>
                        )}
                    </div>
                </div>
            ) : (
                <ListEmployeeImr mesReferencia={mesReferencia} />
            )}
        </div>
    );
}

export default ReportIMR;

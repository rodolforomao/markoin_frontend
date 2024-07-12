import React, { useState, useEffect } from "react";
import { useListEmployeeImrQuery } from '../../api/endpoints/gerarRelatorioImr.endpoint';
import { Table } from "react-bootstrap";

interface ListEmployeeImrProps {
    mesReferencia: string;
}

const ListEmployeeImr: React.FC<ListEmployeeImrProps> = ({ mesReferencia }) => {
    const { data, error, isLoading } = useListEmployeeImrQuery(mesReferencia);

    return (
        <div id='tableDiv' className='overflow-x-scroll'>
            {data && (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>RESPONSÁVEL</th>
                            <th>VERIFICAÇÃO NÚMERO DE DEMANDAS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((rowData: any, rowIndex: number) => {
                            const demands = rowData["numeroDemandas"];
                            const isZeroDemand = demands === 0;
                            return (
                                <tr key={rowIndex}>
                                    <td className={isZeroDemand ? "tdImr text-center" : "text-center"}>{rowIndex + 1}</td>
                                    {Object.values(rowData).slice(1).map((value: any, cellIndex: number) => (
                                        <td className={isZeroDemand ? "tdImr" : ""}>{value}</td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            )}
        </div>
    );
}

export default ListEmployeeImr;

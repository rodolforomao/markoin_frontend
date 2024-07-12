import React, { useState } from 'react';
import { RiFileExcel2Fill } from "react-icons/ri";
import { MdPictureAsPdf } from "react-icons/md";
import ExcelJS from 'exceljs';
import '../../assets/css/print.css';

interface DownloadIMRProps {
    mesReferencia: string;
    data: any;
    error: any;
    isLoading: boolean;
}

const DownloadIMR: React.FC<DownloadIMRProps> = ({ mesReferencia, data, error, isLoading }) => {
    const [downloading, setDownloading] = useState(false);

    const handleDownloadClickExcel = async () => {
        try {
            setDownloading(true);

            if (data) {
                const workbook = new ExcelJS.Workbook();

                // Primeira aba: Relatório
                const worksheetRelatorio = workbook.addWorksheet('IMR');
                worksheetRelatorio.columns = [
                    { header: 'AÇÃO', key: 'acao', width: 20 },
                    { header: 'NÚMERO DO PROCESSO OU DOCUMENTO SEI', key: 'numProcessoDocSei', width: 20 },
                    { header: 'SUBATIVIDADE', key: 'subAtividade', width: 20 },
                    { header: 'DATA DE INÍCIO', key: 'dataInicio', width: 20 },
                    { header: 'DATA DA ENTREGA', key: 'dataEntrega', width: 20 },
                    { header: 'PRAZO MÁXIMO', key: 'prazoMaximo', width: 20 },
                    { header: 'PRAZO MÁXIMO + EXTRAS', key: 'prazoMaximoExtras', width: 20 },
                    { header: 'DATA DE CONCLUSÃO DO PROCESSO', key: 'dataConclusaoProcesso', width: 20 },
                    { header: 'LISTA', key: 'lista', width: 20 },
                    { header: 'NOTA PRAZO', key: 'notaPrazo', width: 20 }, // Fórmula a ser adicionada depois
                    { header: 'FORMA', key: 'forma', width: 20 },
                    { header: 'NOTA FORMA', key: 'notaForma', width: 20 }, // Fórmula a ser adicionada depois
                    { header: 'ARGUMENTO', key: 'argumento', width: 20 },
                    { header: 'NOTA ARGUMENTO', key: 'notaArgumento', width: 20 }, // Fórmula a ser adicionada depois
                    { header: 'PESO', key: 'peso', width: 20 }, // Fórmula a ser adicionada depois
                    { header: 'NOTA PARCIAL', key: 'notaParcial', width: 20 }, // Fórmula a ser adicionada depois
                    { header: 'RESPONSÁVEL', key: 'responsavel', width: 20 },
                    { header: 'FATOR DE PONDERAÇÃO DA MEDIÇÃO (F.P.M.)', key: 'fpm', width: 20 },
                    { header: 'NOTA FINAL', key: 'notaFinal', width: 20 }
                ];

                if (Array.isArray(data)) {
                    data.forEach((row: any, index: number) => {
                        const rowNumber = index + 2; // O ExcelJS começa a contagem das linhas em 1, então incrementamos 1 ao index
                        worksheetRelatorio.addRow(row);
                        // Adicionando fórmulas
                        worksheetRelatorio.getCell(`J${rowNumber}`).value = { formula: `IF(H${rowNumber}*1>G${rowNumber}*1,0,1)` };
                        worksheetRelatorio.getCell(`L${rowNumber}`).value = { formula: `VLOOKUP(K${rowNumber}, 'Ponderação'!A$9:B$13, 2, FALSE)` };
                        worksheetRelatorio.getCell(`N${rowNumber}`).value = { formula: `VLOOKUP(K${rowNumber}, 'Ponderação'!A$9:B$13, 2, FALSE)` };
                        worksheetRelatorio.getCell(`O${rowNumber}`).value = { formula: `VLOOKUP(A${rowNumber}, 'Ponderação'!A$1:F$7, 5, FALSE)` };
                        worksheetRelatorio.getCell(`P${rowNumber}`).value = { formula: `O${rowNumber}*(N${rowNumber}+L${rowNumber}+J${rowNumber})/3` };
                        worksheetRelatorio.getCell(`R2`).value = { formula: `IF(S2>=0.8,Ponderação!A16,IF(S2>=0.6,Ponderação!A17,Ponderação!A18))` };
                        worksheetRelatorio.getCell(`S2`).value = { formula: `=SUM(P2:P9999)/SUM(O2:O9999)` };
                    });
                }

                // Segunda aba
                const worksheetPrazoPeso = workbook.addWorksheet('Ponderação');
                worksheetPrazoPeso.columns = [
                    { header: 'Ação', key: 'acao', width: 40 },
                    { header: 'Nível da Atividade - Relevância', key: 'relevancia', width: 20 },
                    { header: 'Nível da Atividade - Complexidade', key: 'complexidade', width: 20 },
                    { header: 'Nível da Atividade - Criticidade', key: 'criticidade', width: 20 },
                    { header: 'Peso', key: 'peso', width: 10 },
                    { header: 'Duração Máxima (dias úteis)', key: 'duracaoMaxima', width: 20 }
                ];

                const prazosEPesos = [
                    { acao: 'Ação 1 - Assessoria Técnico-Administrativa - CGCONT', relevancia: 5, complexidade: 3, criticidade: 15, peso: 2, duracaoMaxima: 15 },
                    { acao: 'Ação 2 - Assessoria Técnica TI/SUPRA - CGCONT ', relevancia: 5, complexidade: 3, criticidade: 15, peso: 2, duracaoMaxima: 15 },
                    { acao: 'Ação 3 - Assessoria de Controle Externo, Interno e Judicial - CGCONT ', relevancia: 4, complexidade: 3, criticidade: 12, peso: 2, duracaoMaxima: 15 },
                    { acao: 'Ação 4 - Assessoria Técnico-Administrativa - COOR', relevancia: 5, complexidade: 5, criticidade: 25, peso: 2, duracaoMaxima: 15 },
                    { acao: 'Ação 5 - Assessoria Técnico-Administrativa - COCCONV', relevancia: 3, complexidade: 3, criticidade: 9, peso: 1.5, duracaoMaxima: 5 },
                    { acao: 'Ação 6 - Assessoria Técnico-Administrativa - COAC', relevancia: 3, complexidade: 3, criticidade: 9, peso: 1.5, duracaoMaxima: 5 }
                ];

                prazosEPesos.forEach((row) => {
                    worksheetPrazoPeso.addRow(row);
                });

                // tabela FORMA
                worksheetPrazoPeso.addRow({});
                worksheetPrazoPeso.addRow({ acao: 'FORMA', relevancia: 'Nota' });
                const formas = [
                    { descricao: 'Sem erros', nota: 1 },
                    { descricao: 'Recusado 1 vez', nota: 0.5 },
                    { descricao: 'Recusado 2 vezes', nota: 0.3 },
                    { descricao: 'Recusado + 2 vezes', nota: 0 }
                ];
                formas.forEach((row) => {
                    worksheetPrazoPeso.addRow({ acao: row.descricao, relevancia: row.nota });
                });

                // tabela DESEMPENHO
                worksheetPrazoPeso.addRow({});
                worksheetPrazoPeso.addRow({ acao: 'DESEMPENHO', relevancia: 'Intervalo da N.F.', criticidade: 'Fator de Ponderação da Medição' });
                const desempenhos = [
                    { nivel: 'Alto', intervalo: 'NF>=0,8', fator: 1.00 },
                    { nivel: 'Médio', intervalo: '0,6<=NF<0,8', fator: 0.95 },
                    { nivel: 'Baixo', intervalo: 'NF<0,8', fator: 0.90 }
                ];
                desempenhos.forEach((row) => {
                    worksheetPrazoPeso.addRow({ acao: row.nivel, relevancia: row.intervalo, criticidade: row.fator });
                });

                const blob = await workbook.xlsx.writeBuffer();

                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `SIMA_Relatorio_${mesReferencia}.xlsx`);
                document.body.appendChild(link);
                link.click();
            }
        } catch (error) {
            console.error('Erro ao baixar o relatório:', error);
        } finally {
            setDownloading(false);
        }
    };

    const handlePrintClick = () => {
        window.print();
    };

    return (
        <div style={{ display: "flex", justifyContent: 'flex-end' }}>
            <div>
                <button onClick={handleDownloadClickExcel} disabled={downloading || isLoading} style={{ display: 'flex', alignItems: 'center' }}>
                    <RiFileExcel2Fill style={{ marginRight: '0.5rem', height: "30px", width: "100%", fill: "green" }} />
                </button>
            </div>
            <div>
                <button onClick={handlePrintClick} disabled={downloading || isLoading} style={{ display: 'flex', alignItems: 'center' }}>
                    <MdPictureAsPdf style={{ marginRight: '0.5rem', height: "30px", width: "100%", fill: "red" }} />
                </button>
            </div>
            {isLoading && <div>Carregando...</div>}
            {error && <div>Erro ao carregar o relatório</div>}
        </div>
    );
};

export default DownloadIMR;

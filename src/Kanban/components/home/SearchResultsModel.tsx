import React, { useEffect, useRef, useState } from 'react';
import { RiWindowFill } from "react-icons/ri";
import { redirect } from 'react-router-dom';

interface SearchResult {
    issueId: number;
    projectId: number;
    summary: string;
    listName: string;
    projectName: string;
}

interface Props {
    results: SearchResult[];
    onClose: () => void;
}

function SearchResultsModal({ results, onClose }: Props) {
    const modalContentRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 2000);
        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (modalContentRef.current && !modalContentRef.current.contains(event.target as Node)) {
                onClose();
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const redirectToIssue = (id: number, projectId?: number) => {
        const currentURL = new URL(window.location.href);
        let redirectPath = '';

        const basePath = currentURL.origin + currentURL.pathname.split('/').slice(0, -3).join('/') + '/';
        redirectPath = `${basePath}project/${projectId}/board`;

        // Adicionando os parâmetros de consulta
        if (projectId !== undefined) {
            redirectPath += `?idIssueSearch=${id}`;
        } else {
            redirectPath += `&idIssueSearch=${id}`;
        }

        window.location.href = redirectPath;

    };

    return (
        <div className='modelOptionSearch'>
            <div className="modal-content" ref={modalContentRef} style={{ padding: '10px' }}>
                <h2 style={{ fontSize: '14px'}}><b>Cartões</b></h2>
                <br />
                <div className='ulOptionSearch' style={{ maxHeight: '400px', overflowY: 'scroll' }}>
                    {loading ? (
                        <p style={{ fontSize: '15px' }}>Carregando...</p>
                    ) : results.length === 0 ? (
                        <p style={{ fontSize: '15px' }}>Não encontrado nos quadros que você tem permissão</p>
                    ) : (
                        results.map((result, index) => (
                            <div
                            key={index}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                    marginBottom: '10px',
                                    backgroundColor: hoveredIndex === index ? 'rgb(128,128,128,0.3)' : 'transparent',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={() => setHoveredIndex(index)}
                                onMouseLeave={() => setHoveredIndex(null)}
                                onClick={() => redirectToIssue(result.issueId, result.projectId)}
                            >
                                <div className='h-[50px]'>
                                    <RiWindowFill style={{ marginRight: '8px', height: '50px', width: '75%' }} />
                                </div>
                                <div className='w-[100%] flex flex-column'>
                                    <h2 style={{ fontSize: '15px', margin: '0', cursor: 'pointer' }}>{result.summary}</h2>
                                    <p style={{ fontSize: '12px', margin: '0' }}>{result.projectName}: {result.listName}</p>
                                <hr></hr>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default SearchResultsModal;

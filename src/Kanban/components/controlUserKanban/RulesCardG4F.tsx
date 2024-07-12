export const canMoveCard = (fromBlock: string | undefined, toBlock: string, userProfile: number | undefined, lists: { id: number, name: string }[]) => {

    const fromBlockId = parseInt(fromBlock?.match(/\d+/)?.[0] || '');
    const toBlockId = parseInt(toBlock.match(/\d+/)?.[0] || '');

    // Encontrar o nome do bloco correspondente ao ID em fromBlock
    const fromBlockName = lists?.find(block => block.id === fromBlockId)?.name || '';

    // Encontrar o nome do bloco correspondente ao ID em toBlock
    const toBlockName = lists?.find(block => block.id === toBlockId)?.name || '';

    // Se o perfil for Admin é permitido realizar qqlr mudança

    //if (userProfile === 1) { DESCOMENTE PARA APLICAR A REGRA DE MOVER
    return true;
    // }DESCOMENTE PARA APLICAR A REGRA DE MOVER



    // Se o bloco de destino for "SOBRESTADO", o movimento não é permitido
    if (toBlockName === 'SOBRESTADO') {
        if (userProfile !== 4 /* Servidor DNIT */) {
            return false;
        } else {
            return true;
        }
    }

    switch (fromBlockName) {
        case 'BACKLOG':
            // Regra: *Não é possível mover um cartão do bloco "ENTRADA" para os blocos "DNIT REVISA", "BLOCO DE ASSINATURA", "CONCLUÍDO" ou "SAÍDA"
            if (toBlockName === 'DNIT REVISA' || toBlockName === 'BLOCO DE ASSINATURA' || toBlockName === 'CONCLUÍDO' || toBlockName === 'SAÍDA') {
                return false;
            }
            break;
        case 'ENTRADA':
            // Regra: *Não é possível mover um cartão do bloco "ENTRADA" para os blocos "DNIT REVISA", "BLOCO DE ASSINATURA", "CONCLUÍDO" ou "SAÍDA"
            if (toBlockName === 'DNIT REVISA' || toBlockName === 'BLOCO DE ASSINATURA' || toBlockName === 'CONCLUÍDO' || toBlockName === 'SAÍDA') {
                return false;
            }
            break;
        case 'SOBRESTADO':
            // Regra: Em caso de cartão estar no bloco "SOBRESTADO", apenas o "Servidor DNIT" pode movê-lo para dentro ou fora desse bloco
            if (userProfile !== 4 /* Servidor DNIT */) {
                return false;
            }
            break;
        case 'CONCLUÍDO':
            // Regra: A transição do bloco "CONCLUÍDO" para o bloco "SAÍDA" só é permitida ao "Gestor Kanban"
            if (toBlockName === 'SAÍDA' && userProfile !== 2 /* Gestor Kanban */) {
                return false;
            }
            break;
        case 'DNIT REVISA':
        case 'BLOCO DE ASSINATURA':
            // Regra: Para os blocos "DNIT REVISA" e "BLOCO DE ASSINATURA", apenas o "Servidor DNIT" pode mover um cartão para fora desses blocos
            if (userProfile !== 4 /* Servidor DNIT */) {
                return false;
            }
            break;
        default:
            break;
    }

    // Qualquer usuário pode pular as regras acima e mover um cartão, desde que as regras anteriores sejam cumpridas
    return true;
};

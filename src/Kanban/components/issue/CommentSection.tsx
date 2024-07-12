import { useState, useEffect } from 'react';
import axiosDf from '../../api/axios';
import { selectAuthUser } from '../../api/endpoints/auth.endpoint';
import { useCmtsQuery } from '../../api/endpoints/comment.endpoint';
import AddComment from './AddComment';
import Comment from './Comment';

interface Props {
  projectId: number;
  issueId: number;
}

function CommentSection(props: Props) {
  const { projectId, issueId } = props;
  const [showDetails, setShowDetails] = useState(false);
  const [detailsData, setDetailsData] = useState<any[]>([]);
  const { authUser: u } = selectAuthUser();
  const { data: cmts } = useCmtsQuery(props, { refetchOnMountOrArgChange: true });

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axiosDf.get('api/detailMovimentList?issue=' + issueId);
        setDetailsData(response.data);
      } catch (error) {
        console.error('Erro ao carregar detalhes:', error);
      }
    };

    if (showDetails && !detailsData.length) {
      fetchDetails();
    }
  }, [showDetails, detailsData, issueId]);

  if (!u) return null;

  return (
    <div className='mt-4 max-w-[40rem] py-3 text-c-text sm:mx-3'>
      <div className='flex min-w-[35rem] justify-between'>
        <span className='font-medium tracking-wide'>Atividade</span>
        <button className='btn btn-primary' onClick={toggleDetails} >
          {showDetails ? 'Ocultar Detalhes' : 'Mostrar Detalhes'}
        </button>
      </div>
      <AddComment {...{ u, ...props }} />
      <ul className='mt-6' style={{ overflowWrap: 'anywhere' }}>
        {cmts ? (
          cmts.length > 0 ? (
            cmts.map((cmt) => <Comment key={cmt.id} {...{ ...cmt, u, projectId }} />)
          ) : (
            <span className='ml-11 text-gray-700'></span>
          )
        ) : (
          <span>Carregando comentários...</span>
        )}
      </ul>
      {showDetails && (
        <div>
          {detailsData.slice().map((detail, index) => (
            <div key={index} className='mb-4'>
              <p>
                <strong>{detail.user.username}</strong> moveu este cartão de <strong>{detail.oldList.Project.name} - {detail.oldList.name}</strong> para <strong>{detail.currentList.Project.name} - {detail.currentList.name}</strong>
              </p>
              <p className="text-xs text-gray-500">
                {new Date(detail.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CommentSection;

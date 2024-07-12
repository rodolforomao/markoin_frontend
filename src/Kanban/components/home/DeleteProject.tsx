import { useRef } from 'react';
import toast from 'react-hot-toast';
import {
  useDeleteProjectMutation,
  useLeaveProjectMutation,
} from '../../api/endpoints/project.endpoint';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

interface Props {
  name: string;
  projectId: number;
  authUserId: number;
  memberId: number;
  isAdmin?: boolean;
  onClose: () => void;
}

function DeleteProject(props: Props) {


  const { name, projectId, authUserId, memberId, isAdmin, onClose } = props;
  const [deleteProject, { isLoading: dl }] = useDeleteProjectMutation();
  const [leaveProject, { isLoading: ll }] = useLeaveProjectMutation();
  const ref = useRef<HTMLInputElement | null>(null);

  const handleDelete = async () => {
    if (ref.current?.value.trim() !== name) return;
    await deleteProject(projectId);
    toast('Quadro excluído!');
  };

  const handleLeave = async () => {
    await leaveProject({ memberId, projectId, userId: authUserId });
    toast('Saiu do quadro!');
  };

  !isAdmin ? onClose() : null;

  return (
    <div className="modal-overlay" style={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 100 }}>
      <div className="modal show" style={{ display: 'flex', justifyContent: 'center', marginTop: '100px', zIndex: 200 }}>
        {isAdmin ? (
          <Modal.Dialog>
            <Modal.Header style={{ background: '#3d3d3d' }}>
              <Modal.Title> <p style={{ color: 'white' }}>Excluir Quadro </p></Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <p>Por favor digite "<span className='text-chakra-blue'>{name}</span>" para excluir</p>
              <input
                placeholder='Nome do quadro'
                className='ml-8 border-[1px] border-gray-300 bg-c-1 px-2 outline-none'
                ref={ref}
              />
            </Modal.Body>

            <Modal.Footer>
              <Button style={{ background: '#3d3d3d' }} onClick={onClose} variant="secondary"><p style={{ color:'var(--c-5)' }}>Cancelar</p></Button>
              <Button onClick={isAdmin ? handleDelete : handleLeave} variant="primary">
                {isAdmin ? (dl ? 'excluindo ...' : 'Excluir') : ll ? 'Saindo ...' : 'Sair'}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        ) : null}
      </div>
    </div>




  );
}

export default DeleteProject;

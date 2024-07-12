import { useRef } from 'react';
import toast from 'react-hot-toast';
import {
  useDeleteDesktopMutation,
  useLeaveDesktopMutation,
} from '../../api/endpoints/desktop.endpoint';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

interface Props {
  nameDesktop: string;
  desktopId: number;
  authUserId: number;
  memberId: number;
  isAdmin: boolean;
  onClose: () => void;
}

function DeleteDesktop(props: Props) {


  const { nameDesktop, desktopId, authUserId, memberId, isAdmin, onClose } = props;
  const [deleteDesktop, { isLoading: dl }] = useDeleteDesktopMutation();
  const [leaveDesktop, { isLoading: ll }] = useLeaveDesktopMutation();
  const ref = useRef<HTMLInputElement | null>(null);

  const handleDelete = async () => {
    if (ref.current?.value.trim() !== nameDesktop) return;
    await deleteDesktop(desktopId);
    toast('Quadro excluído!');
  };

  const handleLeave = async () => {
    await leaveDesktop({ memberId, desktopId, userId: authUserId });
    toast('Saiu do quadro!');
  };

  return (
    <div className="modal show" style={{ display: 'flex', justifyContent: 'center' }}>
      {isAdmin ? (
        <Modal.Dialog>
          <Modal.Header style={{ background: '#353535' }}>
            <Modal.Title> <p style={{ color: 'white' }}>Excluir Quadro </p></Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>Por favor digite "<span className='text-chakra-blue'>{nameDesktop}</span>" para excluir</p>
            <input
              placeholder='Nome do quadro'
              className='ml-8 border-[1px] border-gray-300 bg-c-1 px-2 outline-none'
              ref={ref}
            />
          </Modal.Body>

          <Modal.Footer>
            <Button style={{ background: '#353535' }} onClick={onClose} variant="secondary"><p style={{ color:'var(--c-5)' }}>Cancelar</p></Button>
            <Button onClick={isAdmin ? handleDelete : handleLeave} variant="primary">
              {isAdmin ? (dl ? 'excluindo ...' : 'Excluir') : ll ? 'Saindo ...' : 'Sair'}
            </Button>
          </Modal.Footer>
        </Modal.Dialog>
      ) : null}
    </div>



  );
}

export default DeleteDesktop;

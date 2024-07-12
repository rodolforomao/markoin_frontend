import { memo, useState } from 'react';
import toast from 'react-hot-toast';
import RTAutosize from 'react-textarea-autosize';
import { AuthUser } from '../../api/apiTypes';
import { useCreateCmtMutation } from '../../api/endpoints/comment.endpoint';
import Avatar from '../util/Avatar';
import { getUrlCompleteBackend } from '../../../utils/getUrl';


interface Props {
  u: AuthUser;
  issueId: number;
  projectId: number;
}

function AddComment(props: Props) {
  const { u, ...data } = props;
  const [descr, setDescr] = useState('');
  const [createCmt, { isLoading }] = useCreateCmtMutation();
  if (!u) return null;

  const len = descr.length;

  const handleCreateCmt = async () => {
    if (len > 500) return;
    await createCmt({ descr, userId: u.id, ...data });
    toast('Comentário adicionado!');
    setDescr('');
  };

  return (
    <div>
      <div className='relative mt-3 flex items-start gap-3'>
        <Avatar src={getUrlCompleteBackend(u)} name={u.username} />
        <RTAutosize
          className='w-full resize-none rounded-[1em] border-[1.0px] border-slate-200 px-3 py-1 text-gray-800 outline-none hover:bg-[#f4f5f7] focus:border-chakra-blue'
          placeholder='Escrever um comentário ...'
          value={descr}
          minRows={1}
          onChange={(e) => setDescr(e.target.value)}
          style={{background: 'var(--c-0)', color:'var(--c-0)'}}
        />
        {descr && (
          <span style={{color:'var(--c-5)'}}
            className={`absolute -bottom-[22px] right-0 text-sm italic ${len > 500 ? 'text-red' : 'text-gray-800'
              }`}
          >
            {len > 500 ? 'limite máximo excedido' : <>{500 - len} caracteres restantes</>}
          </span>
        )}
      </div>
      {descr && (
        <div className='mt-7 flex justify-end gap-1'>
          <button onClick={() => setDescr('')} className='btn-crystal hover:bg-slate-200'>
            Cancelar
          </button>
          <button onClick={handleCreateCmt} className='btn'>
            {isLoading ? 'adiciando...' : 'Adicionar'}
          </button>
        </div>
      )}
    </div>
  );
}

export default memo(AddComment);

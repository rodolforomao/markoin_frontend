import { useState, useEffect  } from 'react';
import toast from 'react-hot-toast';
import Model from './Model';

interface Props {
  msg?: string;
  toastMsg: string;
  onClose: () => void;
  onSubmit: () => Promise<any>;
}

const ConfirmModel = (props: Props) => {
  const { onClose, onSubmit, msg, toastMsg } = props;
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    await onSubmit();
    toast(toastMsg);
    onClose();
  };
  
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleDelete();
      }
    };
    document.addEventListener('keypress', handleKeyPress);
    return () => {
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, []);


  return (
    <Model onClose={onClose} 
    className='max-w-[18rem] bg-gray-200 bg-opacity-100' 
    color_background='bg-gray' 
    >
      <>
        <span>Você tem certeza que quer {msg ?? 'deletar'}?</span>
        <div className='mt-8 flex justify-center gap-x-6'>
          <button
            onClick={onClose}
            className='btn bg-transparent text-black hover:bg-green-100 active:bg-green-200'
            style={{ border: '1px solid #737373', borderRadius: '0.375rem', color:'var(--c-5)' }}
          >
            Cancelar
          </button>
          <button onClick={handleDelete} className='btn bg-red-600 hover:bg-red-700'
            style={{ border: '1px solid #737373', borderRadius: '0.375rem' }}
            >
            {loading ? 'processando ... ' : 'Deletar'}
          </button>
        </div>
      </>
    </Model>
  );
};

export default ConfirmModel;

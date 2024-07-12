import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';
import { getTheme } from '../../utils';


interface Props {
  children: JSX.Element;
  className?: string;
  onClose: () => void;
  onClear?: () => void;
  hasClear?: boolean;
  onSubmit?: () => Promise<void>;
  isLoading?: boolean;
  color_background?: string;
}

const Model = (props: Props) => {
  const { onClose, onSubmit, isLoading, children: ModelBody, className, onClear, hasClear = true, color_background = "" } = props;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && onSubmit) {
        onSubmit(); 
      }
    };
    document.addEventListener('keydown', handleKeyDown); 
    return () => {
      document.removeEventListener('keydown', handleKeyDown); 
    };
  }, [onSubmit]);

  const [theme, setTheme] = useState(getTheme());

  return createPortal(
    <div
      onClick={onClose}
      className='fixed top-0 left-0 z-[1000] grid h-screen w-screen place-items-center overflow-auto bg-[#a7a7a717]'
    >
      <motion.div
        className={`my-8 w-[90%] rounded-[25px] bg-c-1 ${theme.mode === 'light' ? 'light-theme' : 'dark-theme'} ${color_background} p-6 ${className ?? 'max-w-[31rem]'}`}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        onClick={(e) => e.stopPropagation()}
       
      >
        {ModelBody}
        {onSubmit && (
          <div className='mt-8 flex justify-end gap-x-3'>
            {hasClear && (
            <button onClick={onClear} className='rounded-[3px] px-3 py-1 text-c-1 hover:bg-c-3 bg-yellow-200'>
              Limpar
            </button>)}
            <button onClick={onClose} className='rounded-[3px] px-3 py-1 text-c-1 hover:bg-c-3' style={{color:'var(--c-5)'}}>
              Cancelar
            </button>
            <button onClick={onSubmit} className='btn rounded-[3px] bg-blue-400'>
              {isLoading ? 'Criando ...' : 'Criar'}
            </button>
          </div>
        )}
      </motion.div>
    </div>,
    document.getElementById('portal') as Element
  );
};

export default Model;

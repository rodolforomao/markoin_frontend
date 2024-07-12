import { Dispatch,  useEffect, useState } from 'react';
import { forwardRef, useImperativeHandle } from 'react';
import WithLabel from '../util/WithLabel';
import { A, T } from './CreateIssueModal';
import Cookies from 'js-cookie'

interface Props {
  dispatch: Dispatch<A>;
  value: string;
  type: T;
  max: number;
  label: string;
  placeholder: string;
  cookieName?: string;
}

interface TextInputRef {
  value: string;
}

const TextInput = forwardRef<TextInputRef, Props>((props, ref) => {
  const { dispatch, value, type, max, label, cookieName } = props;
  const [initialValueLoaded, setInitialValueLoaded] = useState(false);
  const [textValue, setTextValue] = useState(value);

  // Obter o valor salvo nos cookies, se o nome do cookie estiver definido
  useEffect(() => {
    if (cookieName && !initialValueLoaded) {
      const savedValue = Cookies.get(cookieName);
      if (savedValue) {
        setTextValue(savedValue);
        setInitialValueLoaded(true);
      }
    }
  }, [cookieName, type, initialValueLoaded]);

  // Atualizar o valor nos cookies sempre que ele mudar e o valor atual for diferente do valor salvo nos cookies
  useEffect(() => {
    if (cookieName && textValue !== Cookies.get(cookieName)) {
      Cookies.set(cookieName, textValue);
    }
  }, [cookieName, textValue]);

  useImperativeHandle(ref, () => ({
    value: textValue,
  }));

  return (
    <WithLabel label={label}>
      <div className='relative'>
        <input
            placeholder={props.placeholder}
          //onChange={(e) => dispatch({ type, value: e.target.value })}
          onChange={(e) => {
            setTextValue(e.target.value); // Atualizar o estado interno com o novo valor digitado
            dispatch({ type, value: e.target.value }); // Disparar o valor para o dispatch
          }}
          className='mt-2 block w-full rounded-sm border-2 px-3 py-1 text-sm outline-none duration-200 focus:border-chakra-blue'
          value={textValue}
          style={{background:'var(--c-0)', color:'var(--c-5)'}}
        />
        {textValue && (
          <span style={{color:'var(--c-5)'}}
            className={`absolute right-0 text-sm italic ${
              textValue.length > max ? 'text-red-400' : 'text-gray-800'
            }`}
          >
            {textValue.length > max ? 'Limite de tamanho excedido' : <>{max - textValue.length} caracteres restantes</>}
          </span>
        )}
      </div>
    </WithLabel>
  );
});

export default TextInput;

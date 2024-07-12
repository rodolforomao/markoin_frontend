import { Dispatch, useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { A, T } from '../issue/CreateIssueModal';

import { capitalizeFirstLetterOfWords } from '../../../utils/UpperCase';

import Item from './Item';
import Cookies from 'js-cookie';

type Prop = {
  list: Category[];
  type: 'normal' | 'multiple';
  variant?: 'normal' | 'small';
  defaultValue?: number | Category[];
  onChange?: (index: number) => void; // Adicione a propriedade onChange à interface Prop
  dispatch?: Dispatch<A>;
  actionType: T;
  className?: string;
  cookieName?: string;
  sortList?: boolean;
  identityText?: boolean;
};

const DropDown = (props: Prop) => {
  const {
    list,
    defaultValue: dv,
    type,
    variant = 'normal',
    dispatch,
    actionType,
    className,
    cookieName,
    sortList = false,
    identityText = false,
  } = props;

  let transformedList = list;

  if (identityText) {
    transformedList = transformedList.map(item => ({
      ...item,
      text: capitalizeFirstLetterOfWords(item.text)
    }));
  }

  if(sortList) {
    transformedList = [...transformedList].sort((a, b) => a.text.localeCompare(b.text));
  } 
  

  const isMulti = type === 'multiple';
  const [localList, setLocalList] = useState<Category[]>(
    isMulti ? (dv ? multiDefault(transformedList, dv as Category[]) : transformedList.slice(1)) : transformedList
  );

  const savedValue = cookieName ? Cookies.get(cookieName) : null;
  
  const [current, setCurrent] = useState<Category[] | number>(
    savedValue ? JSON.parse(savedValue) : dv || (isMulti ? [transformedList[0]] : 0)
  );
  const [on, setOn] = useState(false);

  useEffect(() => {
    cookieName ? Cookies.set(cookieName, JSON.stringify(current)) : null;
    }, [current]);

  useEffect(() => {
    if (!dispatch || dv !== undefined || transformedList.length === 0) return;
    const initialValue = transformedList[0].value;
    dispatch({
      type: actionType,
      value: isMulti ? [initialValue] : initialValue,
    });
  }, [dispatch, actionType, isMulti]); // Removendo dv e list do array de dependências

  const handleSelect = (idx: number) => () => {
    const [clone, resultList] = modifyItems(idx, localList, current as Category[]);
    if (dispatch) {
      dispatch({
        type: actionType,
        value: isMulti ? parseIds(resultList) : localList[idx].value,
      });
    }
    setLocalList(clone);
    setCurrent(resultList);
    setOn(false);
  };

  const handleClick = (idx: number) => () => {
    if (idx === current) return setOn(false);
    if (dispatch) {
      dispatch({ type: actionType, value: localList[idx].value });
    }
    setCurrent(idx);
    setOn(false);
  };

  const handleDelete = (e: React.MouseEvent<HTMLSpanElement>, idx: number) => {
    e.stopPropagation();
    const [clone, resultList] = modifyItems(idx, current as Category[], localList);
    if (dispatch) {
      dispatch({
        type: actionType,
        value: isMulti ? parseIds(clone) : localList[idx].value,
      });
    }
    setLocalList(resultList);
    setCurrent(clone);
  };


  return (
    <div
      className={`relative text-[15px] font-medium text-black ${variant === 'normal' ? '' : 'mb-8'
        }`}
    >
      <button
        onClick={() => setOn((p) => !p)}
        className={`flex items-center justify-between border-gray-300 bg-[#edf2f7] px-4 py-1 tracking-wide hover:bg-[#e2e8f0] ${variant === 'normal' ? 'rounded-[4px] border-[1px]' : 'rounded-sm border-none'
          } ${className ?? 'w-full sm:max-w-fit'}`}
        style={{background:'var(--c-0)'}}

      >
        <>
          <div className='flex flex-wrap gap-2'>
            {isMulti && typeof current === 'object' ? (
              current.length > 0 ? (
                current.map((props, i) => (
                  <div
                    key={props.value}
                    className='flex items-center gap-2 border-[1.5px] border-blue-500 px-2 hover:border-green-500'
                    onClick={(e) => handleDelete(e, i)}
                  >
                    <Item size='h-5 w-5' variant={isMulti ? 'ROUND' : 'SQUARE'} {...props} />
                    <Icon className='text-black' icon='akar-icons:cross' style={{color:'var(--c-5)'}}
 />
                  </div>
                ))
              ) : (
                <>Selecione</>
              )
            ) : (
              <Item size='h-4 w-4' {...transformedList[current as number]} />
            )}
          </div>
          <Icon
            style={{color:'var(--c-5)'}}
            className={`ml-3 ${variant === 'normal' ? '' : 'text-[12px]'}`}
            icon='la:angle-down'
          />
        </>
      </button>
      {on && (
        <ul className='absolute bottom-0 z-10 w-full h-[300px] overflow-y-scroll translate-y-[calc(100%+5px)] rounded-[3px] py-2 shadow-md' style={{background:'var(--c-2)'}}>
          {localList.length > 0 ? (
            localList.map((props, idx) => (
              <li
                className='cursor-pointer px-4 py-2 hover:bg-[#e2e8f0]'
                onClick={(isMulti ? handleSelect : handleClick)(idx)}
                key={props.value}
              >
                <Item
                  size={isMulti ? 'w-6 h-6' : 'w-4 h-4'}
                  variant={isMulti ? 'ROUND' : 'SQUARE'}
                  {...transformedList[current as number]}
                  {...props}
                />
              </li>
            ))
          ) : (
            <span className='my-2 block text-center'>Não há elementos</span>
          )}
        </ul>
      )}
    </div>
  );
}

export default DropDown;

export type Category = { text: string; icon?: string; value: number };

// helpers
const modifyItems = (idx: number, list: Category[], resultList: Category[]) => {
  const clone = list.slice(0);
  const deleted = clone.splice(idx, 1)[0];
  const result = [...resultList, deleted];
  return [clone, result];
};

const parseIds = (ary: Category[]) => ary.map(({ value }) => value);

const multiDefault = (list: Category[], dv: Category[]) =>
  list.filter(({ value: V }) => !(dv as Category[]).some(({ value: v }) => v === V));

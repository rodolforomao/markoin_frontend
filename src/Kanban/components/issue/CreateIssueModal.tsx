import { useReducer, useState, useEffect, useRef } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { APIERROR, CreateIssue } from '../../api/apiTypes';
import { selectAuthUser } from '../../api/endpoints/auth.endpoint';
import { useCreateIssueMutation } from '../../api/endpoints/issues.endpoint';
import DropDown from '../util/DropDown';
import WithLabel from '../util/WithLabel';
import Item from '../util/Item';
import Model from '../util/Model';
import type { IssueModalProps } from './IssueModelHOC';
import TextInput from './TextInput';
import toast from 'react-hot-toast';
import { Icon } from '@iconify/react';
import TextAreaInputDesc from './TextAreaInputDesc';
import Cookies from 'js-cookie';
import { isG4F } from '../controlUserKanban/IsG4F';


const CreateIssueModel = (props: IssueModalProps) => {
  const { lists, members, types, priorities, onClose } = props;
  const { authUser: u } = selectAuthUser();
  const [createIssue, { error, isLoading }] = useCreateIssueMutation();
  const [form, dispatch] = useReducer(reducer, initial);
  const [err, setErr] = useState('');
  const [errSei, setErrSei] = useState('');
  const projectId = Number(useParams().projectId);
  let listG4F = isG4F(projectId);
  const textInputRefTitulo = useRef<HTMLInputElement>(null);

  const loggedInUserIndex = u ? members.findIndex(member => member.value === u.id) : -1;
  if (loggedInUserIndex !== -1) {
    const loggedInUser = members[loggedInUserIndex];
    members.splice(loggedInUserIndex, 1);
    members.unshift(loggedInUser);
  }

  if (!u) return null;

  if (error && (error as APIERROR).status === 401) return <Navigate to='/login' />;

  const handleCreateIssue = async () => {
    setErr('')
    setErrSei('')
    
    // Quando a modal é aberta, usando os cookies o form.summary está vazio, porém esse código faz a inicialização da propriedade, caso ela esteja vazia
    if (!form.summary && textInputRefTitulo.current) {
      form.summary = textInputRefTitulo.current.value
    }

    if (!form.summary) return setErr('Escreva o título!');
    // if (form.codigoSei && !/^(\d{5}\.\d{6}\/\d{4}-\d{2}|\(\d{8}\)|\(\d{8}\)|[\d,.\-/]+)$/.test(form.codigoSei)) {
    //   return setErrSei('Código Documento fora do padrão!');
    // }
    if (!u || form.summary.length > 100 || form.descr.length > 500) return;
    await createIssue({ ...form, reporterId: u.id, projectId }); //for now
    toast('Atividade Adicionada!');
    onClose();
  };

  const handleClear = () => {
    setErr('');
    setErrSei('');

    Cookies.remove('cardTitle');
    Cookies.remove('cardSeiNumber');
    Cookies.remove('cardDescription');
    Cookies.remove('CardActivityType');
    Cookies.remove('CardResponsibles');
    Cookies.remove('CardPriorityType');
    Cookies.remove('CardList');

    dispatch({ type: 'summary', value: '' });
    dispatch({ type: 'codigoSei', value: '' });
    dispatch({ type: 'descr', value: '' });
    dispatch({ type: 'type', value: 0 });
    dispatch({ type: 'priority', value: 0 });


    onClose();
  };
  return (
    <Model
      onSubmit={handleCreateIssue}
      onClear={handleClear}
      {...{ onClose, isLoading }} className='max-w-[35rem] c-1'
    >
      <>
        <span className='text-[22px] font-[600] text-c-1' style={{color: 'var(--c-5)'}}>Criar Cartão</span>
        <button onClick={onClose} title='Close' className='btn-icon ml-4 text-lg' style={{ left: "63%", position: "relative", color:'var(--c-5)' }}>
          <Icon icon='akar-icons:cross' />
        </button>
        <TextInput
          type='summary'
          label='Título'
          dispatch={dispatch}
          value={form.summary}
          max={100}
          placeholder='Título do cartão'
          cookieName='cardTitle'
          ref={textInputRefTitulo}
        />
        {err && <span className='-mb-3 block text-sm text-red-400'>{err}</span>}
        <TextInput
          type='codigoSei'
          label='Código Documento'
          dispatch={dispatch}
          value={form.codigoSei}
          max={100}
          placeholder='Digite aqui o nº SEI'
          cookieName='cardSeiNumber'
        />
        {errSei && <span className='-mb-3 block text-sm text-red-400'>{errSei}</span>}
        <TextAreaInputDesc
          type='descr'
          label='Descrição'
          dispatch={dispatch}
          value={form.descr}
          max={500}
          placeholder='Descrição da Atividade'
          cookieName='cardDescription'
        />
        {lists && listG4F && (
          <WithLabel label='Selecione o tipo da atividade'>
            <DropDown
              list={types}
              dispatch={dispatch}
              actionType='type'
              type='normal'
              className='w-full'
              cookieName='CardActivityType'
            />
          </WithLabel>
        )}
        {members && (
          <>
            <WithLabel label='Gestor'>
              <div className='rounded-sm  px-3 py-[5px]' style={{color:'var(--c-0)' }}>
                <Item
                  {...members.filter(({ value: v }) => v === u.id)[0]}
                  size='h-6 w-6'
                  variant='ROUND'
                />
              </div>
            </WithLabel>

            <WithLabel label='Responsavéis'>
              <DropDown
                list={members}
                dispatch={dispatch}
                actionType='assignee'
                type='multiple'
                className='w-full'
                cookieName='CardResponsibles'
              />
            </WithLabel>
          </>
        )}
        <>
          <WithLabel label='Prioridade' >
            <DropDown
              list={priorities}
              dispatch={dispatch}
              actionType='priority'
              type='normal'
              className='w-full'
              cookieName='CardPriorityType'
            />
          </WithLabel>
        </>
        <div >
          {lists && (
            <WithLabel label='Selecione a lista'>
              <DropDown
                list={projectId >= 1 && projectId <= 6 ? [lists[0]] : lists}
                dispatch={dispatch}
                actionType='listId'
                type='normal'
                className='w-full'
                cookieName='CardList'
              />
            </WithLabel>
          )}

        </div>
      </>
    </Model>
  );
};

export default CreateIssueModel;

export type T = 'type' | 'summary' | 'descr' | 'assignee' | 'priority' | 'listId' | 'codigoSei';

export type A = { type: T; value: number | number[] | string };

const initial: State = {
  descr: '',
  summary: '',
  priority: 0,
  type: 0,
  reporterId: null,
  assignees: [],
  listId: null,
  codigoSei: '',
};


type State = Omit<CreateIssue, 'projectId'>;


const reducer = (state: State, { type, value }: A): State => {
  switch (type) {
    case 'type':
      return { ...state, type: value as number };
    case 'summary':
      return { ...state, summary: value as string };
    case 'descr':
      return { ...state, descr: value as string };
    case 'assignee':
      return { ...state, assignees: value as number[] };
    case 'priority':
      return { ...state, priority: value as number };
    case 'listId':
      return { ...state, listId: value as number };
    case 'codigoSei':
      return { ...state, codigoSei: value as string };
    default:
      return state;
  }
};
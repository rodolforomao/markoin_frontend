import { Icon } from '@iconify/react';
import { lazy, Suspense as S, useState, useEffect } from 'react';
import { UpdateIssueType } from '../../api/apiTypes';
import {
  selectIssuesArray,
  useDeleteIssueMutation,
  useUpdateIssueMutation,
} from '../../api/endpoints/issues.endpoint';
import { useAppSelector } from '../../store/hooks';
import DropDown, { Category } from '../util/DropDown';
import Select2 from '../util/Select2';
import WithLabel from '../util/WithLabel';
import type { IssueMetaData, IssueModalProps } from './IssueModelHOC';
import Item from '../util/Item';
import TextareaInput from './TextareaInput';
import Model from '../util/Model';
import CommentSection from './CommentSection';
import { parseDate } from '../../utils';
import { selectAuthUser } from '../../api/endpoints/auth.endpoint';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaEdit } from 'react-icons/fa';
import MenuIssueDetail from './MenuIssueDetail';
import { isG4F } from '../controlUserKanban/IsG4F';
import PeriodReference from './PeriodReference';
const ConfirmModel = lazy(() => import('../util/ConfirmModel'));

const IssueDetailModal = (props: IssueModalProps) => {
  const { issue, control, projectId, members, lists, types, priorities, onClose } = props;
  const { userId } = useAppSelector((s) => s.query.issue);
  const { issues } = selectIssuesArray({ listId: control?.listId ?? 0, projectId, userId });
  const { authUser: u } = selectAuthUser();
  const issueId = issue?.id || 0;
  const pickIssue = issues.find(issue => issue.id === issueId);

  if (!pickIssue) return null

  const {
    id,
    type,
    listId,
    reporterId,
    priority,
    assignees,
    summary,
    descr,
    createdAt,
    updatedAt,
    codigoSei,
  } = pickIssue

  const memberObj = members.reduce((t, n) => ({ ...t, [n.value]: n }), {}) as Category[];
  const [updateIssue] = useUpdateIssueMutation();
  const [deleteIssue] = useDeleteIssueMutation();
  const [isOpen, setIsOpen] = useState(false);
  const isMine = reporterId === u?.id;
  const reporter = members.filter(({ value }) => value === reporterId)[0];
  const isAdmin = control?.isAdmin;

  const valueToFind = listId;
  let textValue = null;


  for (let i = 0; i < lists.length; i++) {
    if (lists[i].value === valueToFind) {
      textValue = lists[i].text;
      break;
    }
  }

  const dispatchMiddleware = async (data: DispatchMiddleware) => {
    const assigneeIds = assignees.map(({ userId }) => userId);
    const body =
      data.type === 'assignee' ? constructApiAssignee(assigneeIds, data.value as number[]) : data;
    if (!body) return;
    await updateIssue({ id, body: { ...body, projectId: Number(projectId) } });
    toast(`Atividade atualizada`);
  };

  const [startDate, setStartDate] = useState(issues.length > 0 ? new Date(issues[control?.idx ?? 0].dataPrazo) : new Date());

  const handleDateChange = (date: Date) => {
    setStartDate(date);
    // Aqui você pode enviar a data para onde for necessário
    dispatchMiddleware({ type: 'dataPrazo', value: date.toISOString() });
  };

  const findTextByListId = (listId: string | number) => {
    let listLength = lists.length;
    let x = 0;
    let listText = '';
    for (x; x < listLength; x++) {
      if (lists[x].value == listId) {
        listText = lists[x].text;
      }
    }
    return listText;
  };

  const textList = findTextByListId(listId);
  const showTypeActivityG4F = isG4F(projectId);

  return (
    <Model onClose={onClose} className=' max-w-[65rem]'>
      <>
        <div className='z-[1000]' style={{ display: "flex" }}>
          <div style={{ width: "80%" }}>

            <div className='flex items-center justify-between text-[16px] text-gray-600' style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <div id="detailIssue" style={{ width: "70%" }}>
                {<TextareaInput
                  type='summary'
                  defaultValue={summary}
                  apiFunc={dispatchMiddleware}
                  className='font-medium sm:text-[22px] sm:font-semibold'
                  placeholder='titulo'
                  max={100}
                  isRequired

                />}
              </div>
              <div style={{ paddingLeft: '5%' }}>
                <p className='mt-1' style={{ fontSize: "14px", color: 'var(--c-5)' }}>
                  Na lista {'>'} <u>{textList}</u>
                </p>
              </div>
            </div>
            <div className='w-full sm:pr-6'>
              {(showTypeActivityG4F && isAdmin && textList === 'SAÍDA') && (
                <PeriodReference issueId={id} periodReference={issue?.periodReference} />
              )}
              <WithLabel label='Prazo de entrega' >
                <div className='w-full sm:pl-6' style={{ position: 'relative', color: 'var(--c-5)' }}>
                  {(!showTypeActivityG4F || (showTypeActivityG4F && isAdmin)) && (
                    <><DatePicker
                      className='input_date_limit'
                      selected={startDate}
                      onChange={handleDateChange}
                      dateFormat="dd/MM/yyyy" /><FaEdit className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400" style={{ position: 'absolute', left: '16%', top: '42%' }} /></>

                  )}
                  {((showTypeActivityG4F && !isAdmin)) && (
                    <div>{startDate.toLocaleDateString('pt-BR')}</div>
                  )}
                </div>
              </WithLabel>
            </div>
            <div className='w-full sm:pr-6'>
              <TextareaInput className='mx-4 w-[46rem]'
                label='Descrição'
                type='descr'
                defaultValue={descr}
                placeholder='Adicionar descrição'
                max={500}
                apiFunc={dispatchMiddleware}
              />
              <TextareaInput className='mx-4 w-[46rem]'
                label='Código Documento'
                type='codigoSei'
                defaultValue={codigoSei}
                placeholder='Adicionar descrição'
                max={500}
                apiFunc={dispatchMiddleware}
              />
              <hr className='ml-3' />
              <div className='mt-3 shrink'>
                <div style={{ display: 'none' }}>
                  <WithLabel label='Status'>
                    <DropDown
                      list={lists}
                      defaultValue={lists.findIndex(({ value: v }) => v === listId)}
                      dispatch={dispatchMiddleware}
                      actionType='listId'
                      type='normal'
                      variant='small'
                    />
                  </WithLabel>
                </div>
                <div style={{ display: 'none' }}>
                  {members && (
                    <WithLabel label='Criado por...'>
                      <div className='rounded-sm bg-[#f4f5f7] px-4 py-[5px] sm:w-fit'>
                        <Item
                          {...reporter}
                          text={reporter && (reporter.text + (isMine ? ' (you)' : ''))}
                          size='h-6 w-6'
                          variant='ROUND'
                        />
                      </div>
                    </WithLabel>
                  )}
                </div>
                {members && (
                  <WithLabel label='Responsável pela Atividade'>
                    <Select2
                      className='mx-4'
                      variant='small'
                      list={members}
                      defaultValue={assignees.map(({ userId }) => memberObj[userId])}
                      dispatch={dispatchMiddleware}
                      actionType='assignee'
                      type='multiple'
                      sortList={true}
                      identityText={true}
                    />
                  </WithLabel>
                )}
                {showTypeActivityG4F && (
                  <WithLabel label='Tipo de Atividade'>
                    <DropDown className='mx-4'
                      variant='small'
                      list={types}
                      defaultValue={types.findIndex(({ value: v }) => v === type)}
                      dispatch={dispatchMiddleware}
                      actionType='type'
                      type='normal'
                    />
                  </WithLabel>
                )}
                <WithLabel label='Prioridade'>
                  <DropDown className='mx-4'
                    variant='small'
                    list={priorities}
                    defaultValue={priority as number}
                    dispatch={dispatchMiddleware}
                    actionType='priority'
                    type='normal'
                  />
                </WithLabel>
                <CommentSection issueId={id} projectId={projectId} />
                <hr className='border-t-[.5px] border-gray-400' />
                <div className='mt-4 text-sm text-gray-700 flex' style={{ justifyContent: 'space-around' }}>
                  {createdAt && <span className='mb-2 flex w-fit' style={{ color: 'var(--c-5)' }}>criada {parseDate(createdAt)}</span>}
                  {updatedAt && <span style={{ color: 'var(--c-5)' }}>atualizado {parseDate(updatedAt)}</span>}
                </div>
              </div>
            </div>
            {isOpen && (
              <S>
                <ConfirmModel
                  onClose={() => setIsOpen(false)}
                  onSubmit={() => deleteIssue({ issueId: id, projectId })}
                  toastMsg='Atividade excluída!'
                />
              </S>
            )}
          </div>
          <div style={{ width: "25%" }}>

            <MenuIssueDetail userId={u?.id} issueId={id} lists={lists} listId={textList} issue={issue} projectId={projectId} />

            <div className='text-black' style={{ textAlign: "end", position: "relative", top: "-10%" }}>

              {isMine && (
                <button onClick={() => setIsOpen(true)} title='Deletar' className='btn-icon text-xl'>
                  <Icon icon='bx:trash' />
                </button>
              )}
              <button onClick={onClose} title='Close' className='btn-icon ml-4 text-lg' style={{ color: 'var(--c-5)' }}>
                <Icon icon='akar-icons:cross' />
              </button>

            </div>
          </div>
        </div>
      </>
    </Model >
  );
};

export default IssueDetailModal;

const constructApiAssignee = (OLD: number[], NEW: number[]): DispatchMiddleware | undefined => {
  const oldLen = OLD.length,
    newLen = NEW.length;
  if (oldLen === newLen) return;
  const userId = newLen > oldLen ? NEW[newLen - 1] : OLD.filter((id) => !NEW.includes(id))[0];
  return {
    type: newLen > oldLen ? 'addAssignee' : 'removeAssignee',
    value: userId,
  };
};

export type DispatchMiddleware = {
  type: UpdateIssueType;
  value: number | number[] | string;
};

const cipher = {
  descr: 'Descrição',
  listId: 'status',
};

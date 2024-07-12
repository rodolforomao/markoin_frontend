import { useEffect, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import { lazy, Suspense as S } from 'react';
import toast from 'react-hot-toast';
import { useDeleteListMutation, useUpdateListMutation } from '../../api/endpoints/lists.endpoint';
import DroppableWrapper from '../dnd/DroppableWrapper';
import DraggableWrapper from '../dnd/DraggableWrapper';
import type { List as LIST } from '../../api/apiTypes';
import type { Issue as  ApiIssue} from '../../types/Issue';
import '../../assets/css/style.css';
import IssueElement from '../issue/Issue';
import { selectCurrentProject } from '../../api/endpoints/project.endpoint';

const IssueModelHOC = lazy(() => import('../issue/IssueModelHOC'));
const CreateIssueModal = lazy(() => import('../issue/CreateIssueModal'));
const ConfirmModel = lazy(() => import('../util/ConfirmModel'));

interface Props extends LIST {
  idx: number;
  issues?: ApiIssue[];
  isDragDisabled: boolean;
  isEmpty?: boolean;
  isAdmin?: boolean;
  title?: string;
}

const List = (props: Props) => {
  const { idx, name: NAME, id, projectId, issues, isEmpty, isDragDisabled, isAdmin, title } = props;
  const [deleteList] = useDeleteListMutation();
  const [name, setName] = useState(NAME);
  const [isEditing, setIsEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [updateList] = useUpdateListMutation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<number | string>('auto');
  const [isHovered, setIsHovered] = useState(false);
  const [on, setOn] = useState(false);
  const { project } = selectCurrentProject(projectId);
  let isDragDisabledList = false;

  if (!project) return null;

  useEffect(() => {
    // Calculate the container height based on the height of the items inside it
    if (containerRef.current) {
      const containerHeight = containerRef.current.scrollHeight;
      setContainerHeight(Math.min(containerHeight, window.innerHeight * 0.1, window.innerHeight * 0.58));
    }
  }, [issues]);

  const handleUpdateList = async () => {
    // when the user saves
    if (name && name !== NAME) {
      await updateList({ listId: id, body: { projectId, name } });
      toast('Nome da lista atualizado!');
    }
    setIsEditing((p) => !p);
  };

  function handleClick() {
    if (isEmpty) return toast.error('Crie uma lista primeiro!');
    setOn(true);
  }

  let listG4FList = project.desktopId;
  let regraCanView = true;

  if (listG4FList === 1) {
    regraCanView = ("ENTRADA".includes(NAME));
    if (isAdmin) {
      isDragDisabledList = false
    } else {
      isDragDisabledList = true
    }
  }

  return (
    <>
          {listG4FList === 1 ? (
      <DraggableWrapper
        className='w-[clamp(16rem,18rem,20rem)]'
        index={idx}
        draggableId={'list-' + id}
        isDragDisabled={isDragDisabledList}
        title={(() => {
          switch (name) {
            case "ENTRADA":
              return "Lista de atividades novas aguardando distribuição por parte do consórcio ou do cliente.";
            case "A FAZER":
              return "Lista de atividades distribuídas para o respectivo analista.";
            case "SOBRESTADO":
              return "Lista de atividades que necessitam de orientação, por parte do cliente, ou até mesmo de informações para prosseguimento.";
            case "DNIT ORIENTA":
              return "Lista de atividades contempladas com orientação, por parte do cliente, ou até mesmo com informações para prosseguimento.";
            case "EM EXECUÇÃO":
              return "Lista de atividades em fase de revisão pela liderança do consórcio.";
            case "EMPRESA REVISA":
              return "Lista de atividades em fase de revisão por parte do consórcio.";
            case "DNIT REVISA":
              return "Lista de atividades em fase de revisão por parte do cliente.";
            case "BLOCO DE ASSINATURA":
              return "Lista de atividades pendente de assinatura por parte do cliente.";
            case "CONCLUÍDO":
              return "Lista de atividades concluídas e em condições de encaminhamento decorrente (Lista de Saída).";
            case "SAÍDA":
              return "Lista de atividades despachadas para o demandante e que serão contabilizadas para medição.";
            default:
              return "";
          }
        })()}
      >
        

        <div className='relative mr-3 bg-c-2 p-3 text-c-5 shadow-list' style={{ borderRadius: "1em" }}>
          <div className='mb-4 flex items-center justify-between text-[15px]'>
            <div className='item-center flex'>
              <div>
                <div className='relative' style={{ fontSize: "13px" }}>
                  {isEditing ? (
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoFocus
                      className='w-36 border-[1.5px] bg-c-2 pl-2 text-[15px] outline-none focus:border-chakra-blue'
                    />
                  ) : (
                    <span className='block border-[1.5px] border-transparent pl-2 font-medium'>
                      {name}
                    </span>
                  )}
                </div>
              </div>
              <span className='mx-2 text-gray-500'>|</span>
              <span className='text-c-4 pt-[1px] font-bold' style={{ fontSize: "13px" }}>{issues ? issues.length : 0}</span>
            </div>
            <div className='flex gap-2'>
              {isEditing && (
                <button
                  onClick={() => setIsOpen(true)}
                  title='Delete'
                  className='btn-icon ml-5 hover:bg-c-3'
                >
                  <Icon icon='bx:trash' className='text-red-500' />
                </button>
              )}
              <button
                onClick={handleUpdateList}
                title={isEditing ? 'Save' : 'Edit'}
                className='btn-icon hover:bg-c-3'
              >
                <Icon icon={isEditing ? 'charm:tick' : 'akar-icons:edit'} />
              </button>
            </div>
          </div>
          <div className='ListResponsive' style={{ height: containerHeight, maxHeight: '55vh', overflow: 'auto' }}>
            <DroppableWrapper className='min-h-[1rem]' type='issue' droppableId={'list-' + id}>
              {issues?.map((data, i) => (
                <IssueElement
                  isDragDisabled={false}
                  key={data.id}
                  listIdx={idx}
                  idx={i}
                  {...data}
                  listId={id}
                  isAdmin={isAdmin}
                  listBadge={data.listBadge}
                  issue={data}
                />
              ))}

            </DroppableWrapper>
          </div>
          <br></br>
          {regraCanView && (
            <button
              onClick={() => {
                setIsHovered(true);
                setTimeout(() => setIsHovered(false), 1000);
                handleClick();
              }}
              style={{
                borderRadius: '8px',
                color: '#ffffff',
                padding: '5px 12px 6px 8px',
                textDecoration: 'none',
                userSelect: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                margin: '0px',
                columnGap: "4px",
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
                width: '100%',
                backgroundColor: '#6a717b',
                transition: 'background-color 0.3s ease',
                opacity: isHovered ? 1 : 0.2,
              }}
              onMouseEnter={() => {
                setIsHovered(true)
                setTimeout(() => setIsHovered(false), 1000);
              }}
              onMouseLeave={() => setIsHovered(false)}
            >
              <Icon icon='ant-design:plus-outlined' style={{ marginRight: '4px' }} />
              Adicionar cartão
              {
                on && !isEmpty && (
                  <S>
                    <IssueModelHOC children={CreateIssueModal} onClose={() => setOn(false)} />
                  </S>
                )}
            </button>
          )}
        </div >
        </DraggableWrapper>
        ) : (
        <DraggableWrapper
          className='w-[clamp(16rem,18rem,20rem)]'
          index={idx}
          draggableId={'list-' + id}
          isDragDisabled={isDragDisabledList}
        >
          
        <div className='relative mr-3 bg-c-2 p-3 text-c-5 shadow-list' style={{ borderRadius: "1em" }}>
          <div className='mb-4 flex items-center justify-between text-[15px]'>
            <div className='item-center flex'>
              <div>
                <div className='relative' style={{ fontSize: "13px" }}>
                  {isEditing ? (
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoFocus
                      className='w-36 border-[1.5px] bg-c-2 pl-2 text-[15px] outline-none focus:border-chakra-blue'
                    />
                  ) : (
                    <span className='block border-[1.5px] border-transparent pl-2 font-medium'>
                      {name}
                    </span>
                  )}
                </div>
              </div>
              <span className='mx-2 text-gray-500'>|</span>
              <span className='text-c-4 pt-[1px] font-bold' style={{ fontSize: "13px" }}>{issues ? issues.length : 0}</span>
            </div>
            <div className='flex gap-2'>
              {isEditing && (
                <button
                  onClick={() => setIsOpen(true)}
                  title='Delete'
                  className='btn-icon ml-5 hover:bg-c-3'
                >
                  <Icon icon='bx:trash' className='text-red-500' />
                </button>
              )}
              <button
                onClick={handleUpdateList}
                title={isEditing ? 'Save' : 'Edit'}
                className='btn-icon hover:bg-c-3'
              >
                <Icon icon={isEditing ? 'charm:tick' : 'akar-icons:edit'} />
              </button>
            </div>
          </div>
          <div className='ListResponsive' style={{ height: containerHeight, maxHeight: '55vh', overflow: 'auto' }}>
            <DroppableWrapper className='min-h-[1rem]' type='issue' droppableId={'list-' + id}>
              {issues?.map((data, i) => (
                <IssueElement
                  isDragDisabled={false}
                  key={data.id}
                  listIdx={idx}
                  idx={i}
                  {...data}
                  listId={id}
                  isAdmin={isAdmin}
                  listBadge={data.listBadge}
                  issue={data}
                />
              ))}

            </DroppableWrapper>
          </div>
          <br></br>
          {regraCanView && (
            <button
              onClick={() => {
                setIsHovered(true);
                setTimeout(() => setIsHovered(false), 1000);
                handleClick();
              }}
              style={{
                borderRadius: '8px',
                color: '#ffffff',
                padding: '5px 12px 6px 8px',
                textDecoration: 'none',
                userSelect: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                margin: '0px',
                columnGap: "4px",
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
                width: '100%',
                backgroundColor: '#6a717b',
                transition: 'background-color 0.3s ease',
                opacity: isHovered ? 1 : 0.2,
              }}
              onMouseEnter={() => {
                setIsHovered(true)
                setTimeout(() => setIsHovered(false), 1000);
              }}
              onMouseLeave={() => setIsHovered(false)}
            >
              <Icon icon='ant-design:plus-outlined' style={{ marginRight: '4px' }} />
              Adicionar cartão
              {
                on && !isEmpty && (
                  <S>
                    <IssueModelHOC children={CreateIssueModal} onClose={() => setOn(false)} />
                  </S>
                )}
            </button>
          )}
        </div >
      </DraggableWrapper >
      )}
      {isOpen && (
        <S>
          <ConfirmModel
            onClose={() => setIsOpen(false)}
            onSubmit={() => deleteList({ listId: id, projectId })}
            toastMsg='Lista deletada!'
          />
        </S>
      )}
    </>
  );
};

export default List;

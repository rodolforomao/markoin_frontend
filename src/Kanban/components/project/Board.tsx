import React, { useState } from 'react';
import { DragDropContext, DraggableLocation } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import DroppableWrapper from '../dnd/DroppableWrapper';
import List from '../list/List';
import { useReorderIssuesMutation } from '../../api/endpoints/issues.endpoint';
import { useCreateListMutation, useReorderListsMutation } from '../../api/endpoints/lists.endpoint';
import type { Issues, List as ApiList } from '../../api/apiTypes';
import { useParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import toast from 'react-hot-toast';
import { canMoveCard } from '../controlUserKanban/RulesCardG4F';
import { selectPermissionKanban } from '../../api/endpoints/permissionKanban.endpoint';
import { selectCurrentProject } from '../../api/endpoints/project.endpoint';
import { isG4F } from '../controlUserKanban/IsG4F';

interface Props {
  lists: ApiList[];
  issues: Issues;
  isDragDisabled: boolean;
  isAdmin: boolean;
}

const Board = (props: Props) => {
  const { lists, issues, isDragDisabled, isAdmin } = props;
  const [reorderLists] = useReorderListsMutation();
  const [reorderIssues] = useReorderIssuesMutation();
  const [createList, { isLoading }] = useCreateListMutation();
  const projectId = Number(useParams().projectId);
  const desktop = selectCurrentProject(projectId);
  const { permissionKanban } = selectPermissionKanban();
  let userProfile: number | undefined;
  if (permissionKanban && permissionKanban.length > 0) {
    userProfile = permissionKanban[0].profileId;
  } else {
    userProfile = undefined;
  }

  let desktopId: undefined | number;
  let listG4F = isG4F(projectId);
  if (desktop.project) {
    desktopId = desktop.project.desktopId;
  }
  const onDragEnd = async ({ type, source: s, destination: d }: DropResult) => {
    if (!lists || !issues || !d || (s.droppableId === d.droppableId && s.index === d.index))
      return;

    try {
      let result;
      if (type === 'list') {
        result = await reorderLists({
          id: lists[s.index].id,
          order: s.index + 1,
          newOrder: d.index + 1,
          projectId,
        });
      } else if (desktopId === 1) {
        if (canMoveCard(s.droppableId, d.droppableId, userProfile, lists) || isAdmin) {
          result = await reorderIssues({
            id: issues[parseId(s)][s.index].id,
            s: { sId: parseId(s), order: s.index + 1 },
            d: { dId: parseId(d), newOrder: d.index + 1 },
            projectId,
          });
        } else {
          toast.error("Você não tem permissão para mover o cartão para este bloco.");
          return;
        }
      } else {
        result = await reorderIssues({
          id: issues[parseId(s)][s.index].id,
          s: { sId: parseId(s), order: s.index + 1 },
          d: { dId: parseId(d), newOrder: d.index + 1 },
          projectId,
        });
      }
    } catch (error) {
      console.error("Erro ao processar a requisição:", error);
      toast.error("Ocorreu um erro ao processar a requisição. Por favor, tente novamente.");
    }
  };

  const handleCreateList = async () => {
    try {
      await createList({ projectId });
      toast.success('Lista Criada!');
    } catch (error) {
      console.error("Erro ao criar a lista:", error);
      toast.error('Ocorreu um erro ao criar a lista. Por favor, tente novamente.');
    }
  };

  return (

    <div className='mt-[8rem] flex min-w-max grow items-start overflow-x-hidden' 
    // style={{ height: "61vh" }}
    >
      <DragDropContext onDragEnd={onDragEnd}>
        <DroppableWrapper
          type='list'
          className='flex items-start'
          droppableId='board-central'
          direction='horizontal'
        >
          {lists.map((props, i) => (
            <List
            key={props.id}
            idx={i}
            issues={issues?.[props.id]}
            isDragDisabled={isDragDisabled}
            isAdmin={isAdmin}
            {...props}
          />          
          ))}
        </DroppableWrapper>

        {(!listG4F || (listG4F && isAdmin)) && (
          <button
            onClick={handleCreateList}
            className='flex items-center gap-5 rounded-md bg-c-2 py-3 px-14 text-c-5 hover:bg-c-6 active:bg-blue-100'
          >
            {isLoading ? (
              'Criando ...'
            ) : (
              <>
                Criar Lista <Icon icon='ant-design:plus-outlined' />
              </>
            )}
          </button>
        )}

      </DragDropContext>
    </div>

  );
};

export default Board;

// helpers
const parseId = (dndObj: DraggableLocation) => +dndObj.droppableId.split('-')[1];

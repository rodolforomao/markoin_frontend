import React, { useState } from 'react';
import { FieldError, FieldValues, useForm } from 'react-hook-form';
import { useCreateProjectMutation } from '../../api/endpoints/project.endpoint';
import { useAuthUserQuery } from '../../api/endpoints/auth.endpoint';
import type { CreateProject } from '../../api/apiTypes';
import InputWithValidation from '../util/InputWithValidation';
import WithLabel from '../util/WithLabel';
import Model from '../util/Model';
import Item from '../util/Item';
import toast from 'react-hot-toast';
import DesktopList from '../desktop/ListsDesktops';

interface Props {
  onClose: () => void;
  selectedId?: number | null;
}

const CreateProjectModel = (props: Props) => {
  const { onClose, selectedId } = props;
  const { data: authUser } = useAuthUserQuery();
  const [createProject] = useCreateProjectMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: isLoading },
  } = useForm();
  const [selectedDesktop, setSelectedDesktop] = useState<string>(selectedId? selectedId.toString() : '');

  const handleCreateProject = async (form: FieldValues) => {
    if (!authUser) return;

    // Extrair o nome do form
    const { name } = form;

    // Converter selectedDesktop para número, se necessário
    const desktopIdNumber = parseInt(selectedDesktop, 10);

    // Verificar se a conversão foi bem-sucedida
    if (isNaN(desktopIdNumber)) {
      // Lidar com o erro de conversão, se necessário
      console.error('Erro ao converter desktopId para número');
      return;
    }

    // Criar um objeto contendo todas as propriedades necessárias para CreateProject
    const projectData: CreateProject = {
      name,
      userId: authUser.id,
      desktopId: desktopIdNumber,      
    };

    await createProject(projectData);
    toast('Novo Quadro criado!');
    onClose();
  };


  return (
    <Model onSubmit={handleSubmit(handleCreateProject)} hasClear={false} {...{ onClose, isLoading }}>
      <>
        <div className='mb-2' >
          <span className='text-[22px] font-[600] text-c-text'>Criar Quadro</span>
        </div>
        <div className='flex flex-col gap-2' style={{color:'var(--c-5)'}}>
          <InputWithValidation
            label='Título do Quadro'
            placeholder='Título do Quadro'
            register={register('name', {
              required: {
                value: true,
                message: 'Título em branco!',
              },
            })}
            error={errors.name as FieldError}
            autoFocus
          />
          <WithLabel label='Área de trabalho'>
            <DesktopList userId={authUser?.id ?? 0} selectedId={parseInt(selectedDesktop, 10)} onChange={(e) => setSelectedDesktop(e.target.value)} />
          </WithLabel>
        </div>
        {authUser && (
          <>
            <div className='mb-2 rounded-sm border-[1px] border-gray-300 bg-slate-100 py-1 px-3 text-sm text-c-text' style={{ display: 'none' }}>
              <Item text={authUser.username} icon={authUser.profileUrl} size='h-6 w-6' variant='ROUND' />
            </div>
          </>
        )}
      </>
    </Model>
  );
};

export default CreateProjectModel;

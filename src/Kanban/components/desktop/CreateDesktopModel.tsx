import { FieldError, FieldValues, useForm } from 'react-hook-form';
import { useCreateDesktopMutation } from '../../api/endpoints/desktop.endpoint';
import { useAuthUserQuery } from '../../api/endpoints/auth.endpoint';
import type { CreateDesktop } from '../../api/apiTypes';
import InputWithValidation from '../util/InputWithValidation';
import WithLabel from '../util/WithLabel';
import Model from '../util/Model';
import Item from '../util/Item';
import toast from 'react-hot-toast';

interface Props {
  onClose: () => void;
}

const CreateDesktopModel = (props: Props) => {
  const { onClose } = props;
  const { data: authUser } = useAuthUserQuery();
  const [createDesktop] = useCreateDesktopMutation();
  const {
    register,
    handleSubmit,

    formState: { errors, isSubmitting: isLoading },
  } = useForm();

  const handleCreateDesktop = async (form: FieldValues) => {
    if (!authUser) return;
    await createDesktop({ ...form, userId: authUser.id } as CreateDesktop);
    toast('Nova Área de Trabalho criada!');
    onClose();
  };

  return (
    <Model onSubmit={handleSubmit(handleCreateDesktop)} {...{ onClose, isLoading }}>
      <>
        <div className='mb-8'>
          <span className='text-[22px] font-[600] text-c-text'>Criar Área de Trabalho</span>
        </div>
        <div className='flex flex-col gap-4'>
          <InputWithValidation
            label='Título da Área de Trabalho'
            placeholder='Título da Área de Trabalho'
            register={register('nameDesktop', {
              required: {
                value: true,
                message: 'Título em branco!',
              },
            })}
            error={errors.name as FieldError}
            autoFocus
          />
        </div>
        {authUser && (

          <>
            <div className='mb-2 rounded-sm border-[1px] border-gray-300 bg-slate-100 py-1 px-3 text-sm text-c-text' style={{ display: "none" }}>
              <Item
                text={authUser.username}
                icon={authUser.profileUrl}
                size='h-6 w-6'
                variant='ROUND'
              />
            </div>
          </>

        )}
      </>
    </Model>
  );
};

export default CreateDesktopModel;

import { FieldError, FieldValues, useForm } from 'react-hook-form';
import { useState } from 'react';
import { AxiosError } from 'axios';
import InputWithValidation from '../util/InputWithValidation';
import { useAuthUserQuery } from '../../api/endpoints/auth.endpoint';
import { Navigate, useNavigate } from 'react-router-dom';
import { APIERROR } from '../../api/apiTypes';
import axiosDf from '../../api/axios';
import toast from 'react-hot-toast';

function Adios() {
  const {
    register,
    formState: { errors, isSubmitting: loading },
    handleSubmit,
  } = useForm();
  const { data: authUser, error } = useAuthUserQuery();
  const [submitError, setSubmitError] = useState('');
  const navigate = useNavigate();

  if (error && (error as APIERROR).status === 401) return <Navigate to='/login' />;

  if (!authUser) return null;

  const name = authUser.username;

  const onSubmit = async (form: FieldValues) => {
    setSubmitError('');
    if (form.name.trim() !== name) return setSubmitError("o nome não corresponde");
    try {
      await deleteACC(form);
      toast('Sua conta foi excluida!');
      navigate('/login');
    } catch (error) {
      setSubmitError(((error as AxiosError).response?.data as APIERROR).message);
    }
  };

  return (
    <main className='bg-jira-gradient grid h-fit min-h-screen w-full place-items-center'>
      <div className='my-8 w-11/12 max-w-[25rem] rounded-md bg-white px-8 pt-12 pb-14'>
        <h1 className='text-xl'>Você está prestes a excluir sua conta</h1>
        <form onSubmit={handleSubmit(onSubmit)} className='mt-6 flex flex-col gap-5'>
          <InputWithValidation
            label='Por favor digite sua senha'
            placeholder='senha da conta'
            register={register('pwd', {
              required: { value: true, message: 'Senha em vazia!' },
              minLength: {
                value: 4,
                message: 'Minimo 4 caracteres',
              },
              maxLength: { value: 14, message: 'Maximo 15 caracteres' },
            })}
            error={errors.pwd as FieldError}
            inputClass='border-gray-500'
            type='password'
          />
          <div>
            <span className='text-sm'>
            Por favor digite "<span className='text-blue-500'>{name}</span>" para confirmar
            </span>
            <InputWithValidation
              label=''
              placeholder={name}
              register={register('name', {
                required: { value: true, message: 'Por favor preencha a caixa' },
              })}
              error={errors.name as FieldError}
              inputClass='border-gray-500'
            />
          </div>
          <div className='mt-2'>
            {submitError && <span className='text-red-500'>{submitError}</span>}
            <button className='btn mt-2 w-full'>
              {loading ? 'deletando ...' : 'Deletar Conta'}
            </button>
            <button
              type='button'
              onClick={() => navigate(-1)}
              className='btn-crystal mt-3 w-full bg-slate-200 hover:bg-slate-100'
            >
              Voltar
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Adios;

const deleteACC = async (body: FieldValues) => {
  const result = await axiosDf.post('api/user/authUser/delete', body, {
    withCredentials: true,
  });
  return result.data;
};

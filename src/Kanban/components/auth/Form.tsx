import { AxiosError } from 'axios';
import { useState } from 'react';
import {
  FieldError,
  FieldErrorsImpl,
  FieldValues,
  UseFormHandleSubmit,
  UseFormRegister,
} from 'react-hook-form';
import toast from 'react-hot-toast';
import { APIERROR } from '../../api/apiTypes';
import InputWithValidation from '../util/InputWithValidation';
import config from '../../../config/config';

interface Props {
  register: UseFormRegister<FieldValues>;
  errors: FieldErrorsImpl<{
    [x: string]: any;
  }>;
  onSubmit: (body: FieldValues) => Promise<any>;
  handleSubmit: UseFormHandleSubmit<FieldValues>;
  type: 'LOGIN' | 'SIGNUP';
  loading: boolean;
}

const base_url_frontend = config.ip + ':' + config.port_frontend;

function Form(props: Props) {
  const { register, onSubmit, handleSubmit, errors, loading, type } = props;
  const [error, setError] = useState('');

  const submit = handleSubmit(async (form) => {
    try {
      await onSubmit(form);
      toast(type === 'LOGIN' ? 'Você fez login!' : 'Sua conta está criada!');
      window.location.replace('http://' + base_url_frontend + '/menu'); //with refresh
    } catch (error) {
      setError(((error as AxiosError).response?.data as APIERROR).message);
    }
  });

  return (
    <form onSubmit={submit}>
      <div className='flex flex-col gap-y-4'>
        <InputWithValidation
          label='Email'
          register={register('email', {
            required: { value: true, message: 'E-mail em branco!' },
            pattern: {
              value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
              message: 'Informe um e-mail válido!',
            },
          })}
          error={errors.email as FieldError}
          inputClass='border-gray-500 bg-white'
          autoFocus
        />
        {type === 'SIGNUP' && (
          <InputWithValidation
            label='Nome Completo'
            register={register('username', {
              required: { value: true, message: 'Usuário em branco!' },
              minLength: {
                value: 2,
                message: 'Usuário precisa ter mais de 2 caracteres',
              },
              pattern: {
                value: /^[A-Za-z0-9_ ]+$/g,
                message: 'Usuário só pode conter letras, números e _',
              },
            })}
            error={errors.username as FieldError}
            inputClass='border-gray-500 bg-white'
          />
        )}
        <InputWithValidation
          label='Senha'
          register={register('pwd', {
            required: { value: true, message: 'Senha em branco!' },
            minLength: {
              value: 5,
              message: 'Senha precisa ter mais de 5 caracteres',
            },
            maxLength: { value: 24, message: 'Máximo de 25 caracteres' },
          })}
          error={errors.pwd as FieldError}
          inputClass='border-gray-500 bg-white'
          type='password'
        />
      </div>
      {error && <span className='mt-3 block text-red-400'>{error}</span>}
      <hr className='mt-3 border-t-[.5px] border-gray-400' />
      <button type='submit' className='btn mt-4 w-full bg-[var(--primary)] py-2 text-[white] hover:text-[white]'>
        {type === 'SIGNUP'
          ? loading
            ? 'Cadastrando ...'
            : 'Cadastre-se'
          : loading
            ? 'Entrando ...'
            : 'Entrar'}
      </button>
    </form>
  );
}

export default Form;

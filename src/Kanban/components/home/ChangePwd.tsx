import { useState } from 'react';
import { FieldError, FieldValues, useForm } from 'react-hook-form';
import type { AxiosError } from 'axios';
import InputWithValidation from '../util/InputWithValidation';
import axiosDf from '../../api/axios';
import toast from 'react-hot-toast';
import { IoCloseSharp } from "react-icons/io5";



type APIERROR = { message: string };

function ChangePwd() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: loading, isSubmitSuccessful: success },
  } = useForm();
  const [error, setError] = useState('');

  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
  };


  const handleChangePwd = async (form: FieldValues) => {
    try {
      await changePwd(form);
      toast('Senha da conta alterada');
      setError('');
    } catch (error) {
      setError(((error as AxiosError).response?.data as APIERROR).message);
    }
  };

  return (
    <>
      {isOpen && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <p className='p-2' style={{ fontWeight: '700', fontSize: '12px', marginBottom: '-3px', marginLeft: '22px', color:'var(--c-5)' }}>Alterar Senha</p>
          <IoCloseSharp onClick={handleClose} style={{ marginLeft: '95px', fontSize: '18px', cursor: 'pointer', color:'var(--c-5)'}} />
        </div>
      )}

      {isOpen && (
        <>
          {success && !error ? (
            <div className='mt-5 grid h-40 place-items-center text-center text-xl font-semibold text-c-text'>
              Senha alterada com sucesso!!
            </div>
          ) : (
            <>
              <div className='flex justify-center w-[16rem] flex-col gap-2 items-center' style={{color:'var(--c-5)'}}>
                <InputWithValidation
                  label='Senha atual'
                  placeholder='Digite sua senha atual'
                  register={register('oldPwd', {
                    required: {
                      value: true,
                      message: 'Senha não pode estar em branco!',
                    },
                  })}
                  error={errors.oldPwd as FieldError}
                  darkEnabled
                  type='password'
                />
                <InputWithValidation
                  label='Nova senha'
                  placeholder='Digite sua nova senha'
                  register={register('newPwd', {
                    required: {
                      value: true,
                      message: 'Senha não pode estar em branco!',
                    },
                    minLength: {
                      value: 4,
                      message: 'Mínimo 4 caracteres',
                    },
                    maxLength: {
                      value: 14,
                      message: 'Máximo 15 caracteres',
                    },
                  })}
                  error={errors.newPwd as FieldError}
                  darkEnabled
                  type='password'
                />
              </div>
              {error && <span className='mt-4 block text-left text-red-400'>{error}</span>}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: '10px' }}>
                <button onClick={handleSubmit(handleChangePwd)} className='btn mt-8 w-30' style={{ fontSize: '12px', marginTop: '5px' }}>
                  {loading ? 'Alterando ...' : 'Alterar'}
                </button>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default ChangePwd;

async function changePwd(body: FieldValues) {
  const result = await axiosDf.put('auth/changePwd', body);
  return result.data;
}

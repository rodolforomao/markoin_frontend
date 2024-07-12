import axios from 'axios';
import { FieldError, FieldValues, useForm } from 'react-hook-form';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { AuthUser } from '../../api/apiTypes';
import { useUpdateAuthUserMutation, useUpdatePhotoProfileUserMutation } from '../../api/endpoints/auth.endpoint';
import InputWithValidation from '../util/InputWithValidation';
import { IoCloseSharp } from "react-icons/io5";

import proxy from 'http-proxy-middleware';

function UpdateProfile({ user: u }: { user: AuthUser }) {
  const [updateAuthUser] = useUpdateAuthUserMutation();
  const [updatePhotoProfileUser] = useUpdatePhotoProfileUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: loading },
  } = useForm();
  const [isOpen, setIsOpen] = useState(true);
  const handleClose = () => {
    setIsOpen(false);
  };
  const handleUpdate = async (form: FieldValues) => {
    if (
      !u ||
      (form.username === u.username && form.email === u.email && form.profileUrl === u.profileUrl)
    )
      return;
    await updateAuthUser(form);
    toast('Perfil Atualizado!');
  };

  ///////////////////////////////////////////////////////////////////////////
  const DownloadAndSendImage = async (url: string) => {
    try {
      const imageBlob = await downloadImage(url);
      if (imageBlob) {
        const result = await sendImageToBackend(imageBlob);
        console.log('Image uploaded successfully', result);
      }
    } catch (error) {
      console.error('Error in downloadAndSendImage:', error);
    }
  };

  const downloadImage = async (url: string): Promise<Blob | null> => {
    try {
      const API_URL = 'https://cors-anywhere.herokuapp.com/'; // CORS Anywhere proxy URL
      const response = await axios.get(API_URL + url, {
        responseType: 'blob',
      });

      if (response.status !== 200) {
        throw new Error(`Failed to download image. Status: ${response.status}`);
      }

      return response.data;
    } catch (error) {
      console.error('Error downloading image:', error);
      return null;
    }
  };

  const sendImageToBackend = async (imageBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('image', imageBlob, 'image.jpg'); // Assuming the file name is 'image.jpg'
      await updatePhotoProfileUser(formData)
    } catch (error) {
      console.error('Error sending image to backend:', error);
    }
  };
  /////////////////////////////////////////////////////////////////////////

  return (
    <>
      {isOpen && (
        <div className='flex justify-center w-[16rem] flex-col gap-2 items-center' style={{ color: 'var(--c-5)' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <p className='p-2' style={{ fontWeight: '700', fontSize: '12px', marginBottom: '-3px', color: 'var(--c-5)' }}>Editar perfil</p>
            <IoCloseSharp onClick={handleClose} style={{ marginLeft: '95px', fontSize: '18px', color: 'var(--c-5)' }} />
          </div>
          <InputWithValidation
            label='Usuário'
            placeholder='username'
            defaultValue={u.username}
            register={register('username', {
              required: { value: true, message: 'Usuário em branco!!' },
            })}
            error={errors.username as FieldError}
            darkEnabled
          />
          <InputWithValidation
            label='E-mail'
            placeholder='email'
            defaultValue={u.email}
            register={register('email', {
              required: { value: true, message: 'E-mail em branco!' },
            })}
            error={errors.email as FieldError}
            readOnly
            darkEnabled
          />
          <InputWithValidation
            label='Foto Perfil'
            placeholder='URL foto perfil'
            defaultValue={u.profileUrl}
            register={register('profileUrl')}
            error={errors.profileUrl as FieldError}
            darkEnabled
          />
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingBottom: '10px' }}>
            <button onClick={handleSubmit(handleUpdate)} className='btn w-30 h-7' style={{ fontSize: '12px' }}>
              {loading ? 'Salvando ...' : 'Salvar'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default UpdateProfile;

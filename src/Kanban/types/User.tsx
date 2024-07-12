export interface UserPhotoProfile {
    id?: number;
    photoProfile?: string;
    formData?: FormData;
  }

  export interface User {
    id: number;
    name: string;
    email: string;
  }

  export type updateUserPhotoProfile = Partial<Pick<UserPhotoProfile, 'id' | 'photoProfile' | 'formData'>>;
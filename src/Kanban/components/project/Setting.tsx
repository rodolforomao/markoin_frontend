import { FieldError, FieldValues, useForm } from 'react-hook-form';
import InputWithValidation from '../util/InputWithValidation';
import MemberInput from './MemberInput';
import {
  selectCurrentProject,
  useUpdateProjectMutation,
} from '../../api/endpoints/project.endpoint';
import { useParams } from 'react-router-dom';
import { selectMembers } from '../../api/endpoints/member.endpoint';
import { selectAuthUser } from '../../api/endpoints/auth.endpoint';
import toast from 'react-hot-toast';
import { IsAdmin } from '../controlUserKanban/ProfileKanban';
import { IsGestorKanban } from '../controlUserKanban/ProfileKanban';
import SelectAddMember from './SelectAddMember';


const Setting = () => {
  const [updateProject, { isLoading }] = useUpdateProjectMutation();
  const projectId = Number(useParams().projectId);
  const { members } = selectMembers(projectId);
  const { authUser: u } = selectAuthUser();
  const { project } = selectCurrentProject(projectId);
  const isAdmin = IsAdmin(projectId); // Verifica profile Admin
  const isGestorKanban = IsGestorKanban(projectId); // Verifica profile Admin


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  if (!project || !members || !u) return null;

  const { id, name } = project;


  const onSubmit = async (formData: FieldValues) => {
    if (formData.name === name) return;
    await updateProject({ id, ...formData });
  };

  return (
    <div className='mt-[2rem] px-5 sm:px-10'>
  
      <form onSubmit={handleSubmit(onSubmit)} className='flex max-w-[30rem] flex-col gap-4'>
        <p style={{fontWeight:'700', fontSize:'13px'}}>Incluir Membro</p>
        <SelectAddMember desktopId={project?.desktopId} project={project?.name} members={members} projectId={projectId} isAdmin={isAdmin} isGestorKanban={isGestorKanban} />
        <MemberInput members={members} projectId={id} isAdmin={isAdmin} isGestorKanban={isGestorKanban} desktopId={project?.desktopId} />
        <div className='mt-1'>
        {(!isAdmin || isGestorKanban) && (isAdmin || !isGestorKanban) && (
            <span className='block text-sm text-red-400'>
              * Somente o administrador pode editar a configuração do quadro *
            </span>
          )}
        </div>
      </form>
    </div>
  );
};

export default Setting;


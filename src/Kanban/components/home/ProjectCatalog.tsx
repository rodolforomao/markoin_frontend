import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { APIERROR, Project } from '../../api/apiTypes';
import { selectAuthUser } from '../../api/endpoints/auth.endpoint';
import { useProjectsQuery } from '../../api/endpoints/project.endpoint';
import { useDesktopsQuery } from '../../api/endpoints/desktop.endpoint';
import SS from '../util/SpinningCircle';
import CreateProjectModel from './CreateProjectModel';
import ProjectRow from './ProjectRow';
import '../../assets/css/style.css';
import { BsPersonWorkspace } from "react-icons/bs";
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';
import DesktopsSelects from '../desktop/DesktopsSelects';
import { useMembersAllProjectsQuery } from '../../api/endpoints/member.endpoint';
import { isG4F } from '../controlUserKanban/IsG4F';

const ProjectCatalog = () => {
  const { authUser } = selectAuthUser();
  const {
    data: projects,
    error: projectsError,
    isLoading: projectsLoading,
  } = useProjectsQuery(authUser?.id as number, { skip: !authUser });

  const {
    data: desktops,
    error: desktopsError,
    isLoading: desktopsLoading,
  } = useDesktopsQuery(authUser?.id as number, { skip: !authUser });

  const [isOpen, setIsOpen] = useState(false);
  const [filtro, setFiltro] = useState('');
  const [filtroValue, setFiltroValue] = useState<number>(0);
  const [title, setFiltroDesktop] = useState('');
  const [desktopId, setDesktopId] = useState<number>(0);
  const [isOpenCreateDesktopBoard, setIsOpenCreateDesktopBoard] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const { data: myMemberProjects, error } = useMembersAllProjectsQuery();


  useEffect(() => {
    // Handle errors if needed
  }, [projectsError, desktopsError]);

  const handleItemClickSelect = (id: number, title: string) => {
    setFiltroValue(id);
    setFiltroDesktop(title);
    setDesktopId(id);
  };

  const handleItemDestopClickSelect = (id: number) => {
    setDesktopId(id);
  };

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setIsOpenCreateDesktopBoard(false);
  };

  if ((projectsError && (projectsError as APIERROR).status === 401) ||
    (desktopsError && (desktopsError as APIERROR).status === 401)) {
    return <Navigate to='/login' />;
  }

  if (!authUser || projectsLoading || desktopsLoading) {
    return (
      <div className='z-10 grid w-full place-items-center bg-c-1 text-xl text-c-text' style={{ paddingTop: '150px' }}>
        {projectsLoading || desktopsLoading ? (
          'Buscando informações'
        ) : (
          <div className='flex items-center gap-6'>
            <span className='text-base'>Não conectado com servidor!</span>
            <SS />
          </div>
        )}
      </div>
    );
  }

  // Filtrando projetos com base no valor do filtro
  let projetosFiltrados = [];

  if (filtroValue) {
    projetosFiltrados = (projects ?? []).filter((projeto) =>
      projeto.desktopId === filtroValue
    );
  } else {
    projetosFiltrados = (projects ?? []).filter((projeto) =>
      projeto.name.toLowerCase().includes(filtro.toLowerCase())
    );
  }

  let isAdmin = false;

  projetosFiltrados.forEach(elemento => {
    if (elemento !== null && elemento.userId === authUser.id) {
      isAdmin = true;
    }
  });

  // Agrupando projetos por desktop
  const projetosPorDesktop: { [desktopId: number]: Project[] } = {};

  projetosFiltrados.forEach(projeto => {
    if (!projetosPorDesktop[projeto.desktopId]) {
      projetosPorDesktop[projeto.desktopId] = [];
    }
    projetosPorDesktop[projeto.desktopId].push(projeto);
  });

  // Adicionando projetos de myMemberProjects se projectId for nulo
  myMemberProjects?.forEach(memberProject => {
    const { projectId, desktopId } = memberProject;
    if (projectId === null) {
      const desktop = desktops?.find(d => d.id === desktopId);
      if (desktop && desktop.projects) {
        if (!projetosPorDesktop[desktopId]) {
          projetosPorDesktop[desktopId] = [];
        }
        projetosPorDesktop[desktopId] = desktop.projects;
      }
    }
  });

  // Filtrando desktops para mostrar apenas aqueles com projetos
  const desktopsComProjetos = desktops?.filter(desktop => projetosPorDesktop[desktop.id]?.length > 0 || projetosPorDesktop[desktop.id]?.length <= 0);

  return (
    <>
      <div className='mx-10 flex h-[100%] w-[12rem] justify-between flex-col'>
        <span className='area_de_trabalho_vertical' style={{ marginBottom: '18px' }}><BsPersonWorkspace className='icon_quadro' />Áreas de trabalho</span>
        {desktops && desktops.map((desktop) => (
          <DesktopsSelects
            key={desktop.id}
            title={desktop.nameDesktop}
            id={desktop.id}
            onTitleClick={() => handleItemClickSelect(desktop.id, desktop.nameDesktop)}
          />
        ))}
      </div>
      <div className='z-10 w-auto min-h-2 overflow-auto bg-c-1 px-10 pb-10 pt-12 text-c-5 top-19 left-0 right-0'>
        {desktopsComProjetos && desktopsComProjetos.map((desktop) => (
          <div className='w-[76rem] mt-8' key={desktop.id}>
            <div>
              <h2 className='font-bold ml-[10px] text-[--c-5]'>{desktop.nameDesktop}</h2>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {(projetosPorDesktop[desktop.id] ?? [])
                .slice()
                .sort((a, b) => a.id - b.id)
                .map((projeto, i) => (
                  <ProjectRow key={projeto.id} idx={i} isAdmin={isAdmin} authUserId={authUser.id} {...projeto} />
                ))}
              <div className='quadros_bt'>
                <Card className='cards_tamanho' style={{ height: '150px', background: 'var(--c-9)' }}>
                  <Card.Body onClick={() => {
                    setIsOpen(true);
                    handleItemDestopClickSelect(desktop.id)
                  }} className='cursor-pointer'>
                    <Card.Title style={{ color: 'var(--c-5)', fontSize: '16px', textAlign: 'center', paddingTop: '15px' }}>
                      {'Criar novo quadro'}
                    </Card.Title>
                    {isOpen && <CreateProjectModel onClose={() => setIsOpen(false)} />}
                    <Card.Text></Card.Text>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </div>
        ))}
      </div>
      {isOpen && <CreateProjectModel selectedId={desktopId} onClose={() => setIsOpen(false)} />}
      {isOpenCreateDesktopBoard && (
        <div className='modelOptionCreate'>
          <ul className='ulOptionCreate'>
            <li className='criar_area_de_trabalho'>
              <button onClick={() => handleOptionClick('desktop')} className='btn btn-primary criar_area' style={{ fontSize: '12px' }}>
                Criar Área de Trabalho
              </button>
            </li>
            <li className='criar_area_quadro'>
              <button onClick={() => handleOptionClick('project')} className='btn btn-primary criar_quadro' style={{ fontSize: '12px' }}>
                Criar Quadro
              </button>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default ProjectCatalog;

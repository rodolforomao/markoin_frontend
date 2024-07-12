import { Icon } from '@iconify/react';
import { lazy, Suspense as S, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Project } from '../../api/apiTypes';

import { usePublicUserQuery } from '../../api/endpoints/auth.endpoint';
import { useMembersAllProjectsQuery } from '../../api/endpoints/member.endpoint';


import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';

import '../../assets/css/style.css';


const DeleteProject = lazy(() => import('./DeleteProject'));

interface Props extends Project {
  idx: number;
  authUserId: number;
  isAdmin?: boolean;
}

const ProjectRow = (props: Props) => {
  const { idx, id, name, userId, authUserId, isAdmin } = props;
  const { data: publicUser } = usePublicUserQuery(userId);
  const [on, setOn] = useState(false);
  const navigate = useNavigate();

  const { data: members, error } = useMembersAllProjectsQuery();
  
  if (!members) return null;
  const { id: memberId } = members.filter(({ userId: u }) => u === authUserId)[0];

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    setOn(true);
  };

  let url_background = getImage(name);

  return (
    <div>
      <div
        key={id}
        className='flex'
        onClick={() => navigate(id + '/board')}
      >

        <div className='quadros_bt cursor-pointer' >
        
          <Card className='cards_tamanho border-none outline-1 outline outline-[transparent] transition-all hover:outline-1 hover:outline hover:outline-[var(--c-5)]' style={{height: '150px', backgroundSize:"cover", backgroundImage: 'url('+ url_background +') ' , transition: 'all 0.5s ease'}}>
            <Card.Body className='p-0'>
            <Card.Title style={{ color: 'white', fontSize: '16px', fontWeight: '700', transition: 'all 0.5s ease'}} className="rounded-t bg-[rgb(0,0,0,0.55)] p-2 font-['Roboto'!important] font-[sans-serif] hover:bg-[rgb(0,0,0,0.75)]">{name}</Card.Title>
              <button
                style={{ position: 'absolute', bottom: 0, right: 0, transition: 'all 0.3s ease'}}
                title='Deletar ou Sair'
                onClick={handleDelete}
                className='btn-icon hover:bg-black'
              >
                <Icon icon='bx:trash' style={{ color: 'white' }} className='mix-blend-difference'  />
              </button>
              <Card.Text>
              </Card.Text>
            </Card.Body>
          </Card>

        </div>
      </div>


      {
      on && publicUser && (
        <S>
          <DeleteProject
            projectId={id}
            {...{ name, authUserId, memberId, isAdmin }}
            onClose={() => setOn(false)}
          />
        </S>
      )}
    </div>
  );
}

function getImage(value: string) {
  let filename = 'postit.jpg'
  if (value.toLowerCase().includes('supra')) {
    filename = "laptop-apple.jpg";
  }
  else if (value.toLowerCase().includes('judicial') || value.toLowerCase().includes('jurídico')) {
    filename = "judge.jpg";
  }
  else if (value.toLowerCase().includes('coor')) {
    filename = "strategy.jpg";
  }
  else if (value.toLowerCase().includes('coac')) {
    filename = "roadhorizon.jpg";
  }
  else if (value.toLowerCase().includes('cocconv')) {
    filename = "destopphotographies.jpg";
  }
  else {
    const index = Math.abs(hashCode(value.toString())) % imageList.length;
    filename = imageList[index];
  }
  const path = '/assets/background/trl/'
  return path + filename;
}

function hashCode(str: string): number {
  let hash = 0;
  if (str.length == 0) return hash;
  for (let i = 0; i < str.length; i++) {
    let char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

const imageList: string[] = [
  "baloons.jpg",
  "baloons2.jpg",
  "beach.jpg",
  "businessmodel.jpg",
  "chalk.jpg",
  "colors.jpg",
  "desktop.jpg",
  "desktop2.jpg",
  "destopglobalstudies.jpg",
  "destopphotographies.jpg",
  "flower.jpg",
  "grativity.jpg",
  "horses.jpg",
  "judge.jpg",
  "judge2.jpg",
  "judge3.jpg",
  "laptop-apple.jpg",
  "lecture.jpg",
  "moviemachine.jpg",
  "naturefreeze.jpg",
  "postit.jpg",
  "road.jpg",
  "roadhorizon.jpg",
  "squares.jpg",
  "strategy.jpg",
  "sunset.jpg",
  "train.jpg",
  "writemachine.jpg",
  "writemachine.png"
];


export default ProjectRow;

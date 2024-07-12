// Import axios and moment if not already imported
import axiosDf from './api/axios';
import moment from 'moment';
import { getProjectIds } from './components/controlUserKanban/IsG4F';


export function getTheme(): Theme {
  const localTheme = localStorage.getItem('jira-clone-theme');
  return localTheme ? JSON.parse(localTheme) : { mode: 'light' };
}

export function setTheme(mode: Theme['mode']) {
  localStorage.setItem(
    'jira-clone-theme',
    JSON.stringify({
      mode: mode === 'light' ? 'dark' : 'light',
    })
  );
}

export const parseDate = (s: string) => convertDateToPt(moment(s).fromNow());

function convertDateToPt(s: string) {
  if (s !== undefined && s !== null && s !== "") {
    s = s.replace('ago', 'atrás')
    s = s.replace('second', 'segundo')
    s = s.replace('minute', 'minuto')
    s = s.replace('hour', 'hora')
    s = s.replace('day', 'dia')
    s = s.replace('months', 'meses')
    s = s.replace('month', 'mês')
    s = s.replace('year', 'ano')
    s = s.replace('few', 'alguns')
  }
  return s;
}

export type Theme = { mode: 'light' | 'dark' };

const listG4FList = getProjectIds();

// Define the types function
export const types = async (projectId: number) => {
  // Check if projectId is within the specified range
  if (!(await listG4FList).includes(projectId)) {
    return Promise.resolve([]); // Return an empty array if projectId is not within the range
  }

  // Make the request only if projectId is within the range
  return axiosDf.get(`api/listActivity?projectId=${projectId}`)
    .then((resultado) => {
      // Combine the static data with the dynamic data obtained from the API call
      const typesData = resultado.data.map((item: any) => ({
        text: `${item.id} - ${item.desc_atividades}`,
        value: item.id
      }));
      return typesData; // Return the activity types
    })
    .catch((erro) => {
      throw new Error('Erro ao buscar tipos de atividade da lista');
    });
};

export const priorities = [
  { text: 'Mínima ', icon: '/assets/lowest.svg', value: 0 },
  { text: 'Baixa', icon: '/assets/low.svg', value: 1 },
  { text: 'Média', icon: '/assets/medium.svg', value: 2 },
  { text: 'Alta', icon: '/assets/high.svg', value: 3 },
  { text: 'Urgente', icon: '/assets/highest.svg', value: 4 },
];

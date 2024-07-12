// Import axios and moment if not already imported
import moment from 'moment';

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

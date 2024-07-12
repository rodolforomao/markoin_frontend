import Cookies from 'js-cookie';

const COOKIE_NAME = 'tipoAtividade';

export function salvarCookieTipoAtividade(valor: string): void {
  Cookies.set(COOKIE_NAME, valor);
}

export function obterCookieTipoAtividade(): string | undefined {
  return Cookies.get(COOKIE_NAME);
}


import { Member } from '../Kanban/types/Member';
import config from '../config/config';
import type {AuthUser as AuthUserType} from '../types/AuthUser'
import type {AuthUser} from '../types/AuthUser'

const base_url_backend = config.ip + ':' + config.port_backend + '/';

function getUrlCompleteBackend(u: AuthUserType | AuthUser | undefined) {
    if (!u) return ;
    if(typeof u === 'string') return ;
    if(!u.profileUrl) return ;
    let extension = '.' + new URL(u.profileUrl).pathname.substring(new URL(u.profileUrl).pathname.lastIndexOf('.') + 1);
    return window.location.protocol + '//' + (base_url_backend + 'profile/' + u.id).replaceAll('\\', '/').replaceAll('//', '/') + extension;
}

function getUrlCompleteByIdUserBackend(u: Member, userId: number) {
    if (!u) return ;
    if(typeof u === 'string') return ;
    if(!u.profileUrl) return ;
    let extension = '.' + new URL(u.profileUrl).pathname.substring(new URL(u.profileUrl).pathname.lastIndexOf('.') + 1);
    return window.location.protocol + '//' + (base_url_backend + 'profile/' + userId).replaceAll('\\', '/').replaceAll('//', '/') + extension;
}



export {getUrlCompleteBackend, getUrlCompleteByIdUserBackend};


import { FC, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { selectLists } from '../../api/endpoints/lists.endpoint';
import { selectMembers } from '../../api/endpoints/member.endpoint';
import { types as fetchTypes, priorities } from '../../utils';
import { Category } from '../util/DropDown';

import { Issue as IssueType } from '../../types/Issue';

export type IssueMetaData = { listIdx: number; listId: number; idx: number, isAdmin: boolean | undefined };

interface Props {
  onClose: () => void;
  children: FC<IssueModalProps>;
  issue?: IssueType;
  control?: IssueMetaData;
  isAdmin?: boolean;
}

const IssueModelHOC = (props: Props) => {
  const projectId = Number(useParams().projectId);
  const { isAdmin: isAdmin, children: Component, ...PROPS } = props;
  const { members: apiMembers } = selectMembers(projectId);
  const { lists: apiLists } = selectLists(projectId);

  const [types, setTypes] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchTypes(projectId)
      .then(data => {
        setTypes(data);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        // Trate o erro, se necessário
      });
  }, [projectId]);

  const members = apiMembers
    ? (apiMembers.map(({ username: u, profileUrl: p, userId }) => ({
      text: u,
      icon: p,
      value: userId,
    })) as Category[])
    : [];
  const lists = apiLists
    ? (apiLists.map(({ id, name }) => ({
      text: name,
      value: id,
    })) as Category[])
    : [];

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <Component
      {...{
        projectId,
        lists,
        members,
        types,
        priorities,
        isAdmin
      }}
      {...PROPS}
    />
  );
};

export default IssueModelHOC;

export interface IssueModalProps {
  projectId: number;
  issue?: IssueType;
  control?: IssueMetaData;
  members: Category[];
  lists: Category[];
  types: Category[];
  priorities: Category[];
  onClose: () => void;
  isAdmin: boolean | undefined;
}

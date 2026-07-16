import {
  type WorksDef,
  type WorksList,
  type WorksListResponse,
  type WorksLlmsList,
  type WorksLlmsListResponse,
  type WorksNavItem,
  type WorksNavResponse,
} from '../_types';
import { client } from './microcms';

export const getPostById = async (id: string): Promise<WorksDef> => {
  const data = await client.get<WorksDef>({
    endpoint: `works/${id}`,
  });
  return data;
};

export const getPosts = async (): Promise<WorksList[]> => {
  const data = await client.get<WorksListResponse>({
    endpoint: 'works',
    queries: {
      fields: 'id,category,part,thumbnail,text,siteType,title,updatedAt',
    },
  });
  return data.contents;
};

export const getPostsForLlms = async (): Promise<WorksLlmsList[]> => {
  const data = await client.get<WorksLlmsListResponse>({
    endpoint: 'works',
    queries: {
      fields: 'id,category,language,part,siteType,text,title,tool,url,year',
    },
  });
  return data.contents;
};

export const getPostsNav = async (): Promise<WorksNavItem[]> => {
  const data = await client.get<WorksNavResponse>({
    endpoint: 'works',
    queries: {
      fields: 'id,title',
    },
  });
  return data.contents;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
import http from '../src/utils/http';
import { Model } from './models';

export const fetchItems = (model: Model) =>
  http.get(`/admin/${model.key}`, true);

export const createItem = (model: Model, item: any) =>
  http.post(`/admin/${model.key}`, item);

export const editItem = (model: Model, item: any) =>
  http.put(`/admin/${model.key}/${item.id}`, item);

export const deleteItem = (model: Model, item: any) =>
  http.delete(`/admin/${model.key}/${item.id}`);

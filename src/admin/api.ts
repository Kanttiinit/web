import http from '../http';
import { Model } from './models';

export const fetchItems = (model: Model) =>
  http.get(`/admin/${model.key}`, true);

export const createItem = (model: Model, item: any) =>
  http.post(`/admin/${model.key}`, item);

export const editItem = (model: Model, item: any) => Promise.resolve(console.log(model, item));
  //http.put(`/admin/${model.key}/${item.id}`, item);

export const deleteItem = (model: Model, item: any) =>
  http.delete(`/admin/${model.key}/${item.id}`);

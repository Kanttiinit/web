import { createEffect, For, Show } from 'solid-js';
import { createStore, produce, unwrap } from 'solid-js/store';
import { Dynamic } from 'solid-js/web';
import Button from '../components/Button';
import { get } from '../utils';
import * as api from './api';
import { showMessage } from './index';
import inputs from './inputs';
import { Model } from './models';

interface Props {
  mode: 'creating' | 'editing';
  onSuccess: () => void;
  onCancel: () => void;
  onError?: () => void;
  item?: any;
  model: Model;
}

function setToValue(obj: any, p: string, value: any) {
  let i;
  const path = p.split('.');
  for (i = 0; i < path.length - 1; i++)
      obj = obj[path[i]];

  obj[path[i]] = value;
}

export default function Editor(props: Props) {
  const [item, setItem] = createStore<any>();

  createEffect(() => {
    const item = { ...unwrap(props.item) };
    delete item.createdAt;
    delete item.updatedAt;
    setItem(item);
  });

  const save = async (e: SubmitEvent) => {
    e.preventDefault();
    try {
      if (props.mode === 'editing') {
        await api.editItem(props.model, unwrap(item));
      } else {
        await api.createItem(props.model, unwrap(item));
      }

      props.onSuccess();
      showMessage('The item has been saved.');
    } catch (error) {
      console.error(error);
      showMessage('Error: ' + (error as any).message);
    }
  };

  const deleteItem = async () => {
    if (confirm('Are you sure?')) {
      await api.deleteItem(props.model, props.item);
      props.onSuccess();
      showMessage('The item has been deleted.');
    }
  };

  const setValue = (key: string, value: any) => setItem(produce(s => {
    setToValue(s, key, value);
  }));

  return (
    <Show when={item}>
      <h1>
        {props.mode === 'editing' ? 'Edit ' : 'Create new '}
        {props.model.name}
      </h1>
      <form onSubmit={save}>
        <div>
          <For each={props.model.fields}>
            {field => {
              return (
              <div>
                <Dynamic
                  component={inputs[field.type!] || inputs._}
                  field={field}
                  value={'fields' in field
                    ? field.fields.map(f => get(item, f.path))
                    : get(item, field.path)}
                  setValue={setValue}
                />
              </div>
              );
            }}
          </For>
        </div>
        <div>
          <Button type="submit" color="primary">
            {props.mode === 'creating' ? 'Create' : 'Save'}
          </Button>
          {' '}
          {props.mode === 'editing' && <><Button onClick={deleteItem}>Delete</Button>{' '}</>}
          <Button onClick={props.onCancel} secondary>
            Cancel
          </Button>
        </div>
      </form>
    </Show>
  );
}

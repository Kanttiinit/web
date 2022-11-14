import { createEffect, createSignal, For, Show } from 'solid-js';
import { unwrap } from 'solid-js/store';
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

export default function Editor(props: Props) {
  const [item, setItem] = createSignal<any>();
  const [mode, setMode] = createSignal<string>();

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
        await api.editItem(props.model, item());
      } else {
        await api.createItem(props.model, item());
      }

      setMode(undefined);
      props.onSuccess();
      showMessage('The item has been saved.');
    } catch (e) {
      showMessage('Error: ' + e.message);
    }
  };

  const deleteItem = async () => {
    if (confirm('Are you sure?')) {
      await api.deleteItem(props.model, props.item);
      props.onSuccess();
      showMessage('The item has been deleted.');
    }
  };

  const setValue = (key: string | string[], value: any) =>
    setItem(set(key, value, item()));

  return (
    <Show when={item()}>
      <h1>
        {mode() === 'editing' ? 'Edit ' : 'Create new '}
        {props.model.name}
      </h1>
      <form onSubmit={save}>
        <div>
          <For each={props.model.fields}>
            {field => {
              const InputComponent = inputs[field.type!] || inputs._;
              const value =
                'fields' in field
                  ? field.fields.map(f => get(item(), f.path))
                  : get(item(), field.path);

              return (
                <div>
                  <InputComponent
                    field={field}
                    value={value}
                    setValue={setValue}
                  />
                </div>
              );
            }}
          </For>
        </div>
        <div>
          <Button type="submit" color="primary">
            {mode() === 'creating' ? 'Create' : 'Save'}
          </Button>
          {mode() === 'editing' && <Button onClick={deleteItem}>Delete</Button>}
          <Button onClick={props.onCancel} color="secondary">
            Cancel
          </Button>
        </div>
      </form>
    </Show>
  );
}

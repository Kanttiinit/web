import { sort } from 'fast-sort';
import {
  createEffect,
  createMemo,
  For,
  Match,
  onMount,
  Show,
  Switch
} from 'solid-js';
import { createStore } from 'solid-js/store';
import { styled } from 'solid-styled-components';
import Button from '../components/Button';
import { get } from '../utils';
import * as api from './api';
import Editor from './Editor';
import { Model } from './models';

const Table = styled.table`
  width: 100%;

  th {
    text-align: left;
    white-space: nowrap;
  }

  tbody {
    tr {
      cursor: pointer;

      &:nth-child(2n) {
        background: #eee;
      }

      &:hover {
        background: #ddd;
      }
    }

    td {
      padding: 0.5rem;
    }
  }
`;

const ModalBg = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(1px);
`;

const Modal = styled.div`
  position: fixed;
  width: 30rem;
  left: calc(50% - 15rem);
  max-height: 90vh;
  overflow: auto;
  background: white;
  top: 3rem;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.2);

  h1 {
    padding: 0;
    margin: 0 0 1rem 0;
    font-size: 1.5rem;
  }
`;

interface Props {
  model: Model;
}

interface State {
  mode?: 'editing' | 'creating';
  item?: any;
  sortedColumn?: string;
  sortDirection: 'asc' | 'desc';
  items: any[];
  loading: boolean;
}

function Value(props: { value: any }) {
  return (
    <Switch>
      <Match
        keyed
        when={
          typeof props.value === 'string' &&
          props.value.startsWith('http') &&
          props.value
        }
      >
        {value => (
          <a href={value} target="_blank" rel="noreferrer">
            {value}
          </a>
        )}
      </Match>
      <Match when={typeof props.value === 'boolean'}>
        {props.value ? 'Yes' : 'No'}
      </Match>
      <Match when={true}>{props.value}</Match>
    </Switch>
  );
}

export default function DataTable(props: Props) {
  const [state, setState] = createStore<State>({
    sortDirection: 'asc',
    items: [],
    loading: false
  });

  const openCreateDialog = () =>
    setState({ mode: 'creating', item: undefined });

  const hideDialog = () => setState({ mode: undefined });

  const getSortIndicator = (sortedColumn: string) =>
    sortedColumn === state.sortedColumn
      ? state.sortDirection === 'asc'
        ? '︎︎↑'
        : '↓'
      : '';

  const changeSort = (columnKey: string) => {
    const { sortedColumn, sortDirection } = state;
    if (sortedColumn === columnKey) {
      setState({
        sortDirection: sortDirection === 'asc' ? 'desc' : 'asc'
      });
    } else {
      setState({ sortedColumn: columnKey, sortDirection: 'asc' });
    }
  };

  const onEditorSuccess = async () => {
    hideDialog();
    setState({ loading: true, items: [] });
    setState({ loading: false, items: await api.fetchItems(props.model) });
  };

  const sortedItems = createMemo(
    () =>
      /*state.sortedColumn
    ? sort(state.items).by({ [state.sortDirection]: state.sortedColumn! })
    : */ state.items
  );

  const resetSort = () => {
    setState({
      sortedColumn: props.model.defaultSort,
      sortDirection: 'asc'
    });
  };

  createEffect(async () => {
    setState({ loading: true, items: [] });
    setState({ loading: false, items: await api.fetchItems(props.model) });
  });

  onMount(() => {
    resetSort();
  });

  return (
    <>
      {!!state.mode &&
        <>
          <ModalBg onClick={hideDialog} />
          <Modal>
            <Editor
              model={props.model}
              mode={state.mode}
              item={state.item}
              onSuccess={onEditorSuccess}
              onCancel={hideDialog}
            />
          </Modal>
        </>
      }
      <Button style={{ margin: '1em 0' }} onClick={openCreateDialog}>
        Create
      </Button>
      <Show when={!state.loading} fallback={<p>Loading...</p>}>
        <div style={{ 'overflow-x': 'auto' }}>
          <Table>
            <thead>
              <tr>
                <For each={props.model.tableFields}>
                  {field => (
                    <th>
                      {/* <TableSortLabel
                      direction={state.sortDirection}
                      onClick={() => changeSort(field.key)}
                      active={state.sortedColumn === field.key}
                    > */}
                      {field.name}
                      {/* </TableSortLabel> */}
                    </th>
                  )}
                </For>
              </tr>
            </thead>
            <tbody>
              <For each={sortedItems()}>
                {item => (
                  <tr onClick={() => setState({ mode: 'editing', item })}>
                    <For each={props.model.tableFields}>
                      {field => (
                        <td>
                          <Value value={get(item, field.key)} />
                        </td>
                      )}
                    </For>
                  </tr>
                )}
              </For>
            </tbody>
          </Table>
        </div>
      </Show>
    </>
  );
}

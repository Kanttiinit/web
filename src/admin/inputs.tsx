import { createSignal, For } from 'solid-js';
import LatLngInput from '../components/LatLngInput';
import OpeningHoursInput from '../components/OpeningHoursInput';
import * as api from './api';
import models from './models';
import {
  EnumField,
  ModelField,
  ModelFieldGroup,
  RelationField
} from './models';
import Input from '../components/Input';
import format from 'date-fns/format';
import { styled } from 'solid-styled-components';
import { get } from '../utils';
import Toggle from '../components/Toggle';
import { Dynamic } from 'solid-js/web';

interface InputProps {
  value: any;
  field: ModelField;
  setValue(path: string, value: any): any;
}

interface GroupInputProps {
  value: any[];
  field: ModelFieldGroup;
  setValue(path: string, value: any): any;
}

const Row = styled.div`
  display: flex;
  gap: 1rem;
`;

const Col = styled.div`
  flex: 1;
`;

const Control = styled.label`
  margin-bottom: 1rem;
`;

const Label = styled.div`
  
`;

const UrlInput = (props: InputProps) => (
  <>
    <Input
      label={props.field.title}
      onChange={(e: string) => props.setValue(props.field.path, e)}
      value={props.value || ''}
      type="text"
    />
    <a target="_blank" href={props.value}>
      Open
    </a>
  </>
);

const MenuUrlInput = (props: InputProps) => {
  const now = () => new Date();
  const link = () =>
    props.value &&
    props.value
      .replace('%year%', format(now(), 'yyyy'))
      .replace('%month%', format(now(), 'mm'))
      .replace('%day%', format(now(), 'dd'));
  return (
    <>
      <Input
        onChange={value => props.setValue(props.field.path, value)}
        value={props.value || ''}
        type="text"
        label={props.field.title}
      />
      <a target="_blank" href={link()}>
        Open
      </a>
    </>
  );
};

function AddressInput(props: InputProps) {
  return (
    <Input
      onChange={value => props.setValue(props.field.path, value)}
      value={props.value || ''}
      label={props.field.title}
      type="text"
    />
  );
}

const RegExpInput = (props: InputProps) => {
  const [test, setTest] = createSignal('');
  const match = () => !!test().match(new RegExp(props.value));
  return (
    <Row>
      <Col>
        <Input
          label={props.field.title}
          onChange={(e: any) => props.setValue(props.field.path, e.target.value)}
          value={props.value || ''}
          type="text"
        />
      </Col>
      <Col>
        <Input
          label="Test value"
          value={test()}
          onChange={value => setTest(value)}
        />
        <small style="margin-top: -0.5rem; display: block;">
          {match() ? 'The regexp matches this value.' : 'The regexp does not match this value.'}
        </small>
      </Col>
    </Row>
  );
};

export const BooleanInput = (props: InputProps) => (
  <Control>
    {props.field.title}<br />
    <Toggle
      selected={props.value || false}
      onChange={v =>
        props.setValue(props.field.path, v)
      }
    />
  </Control>
);

const NumericInput = (props: InputProps) => (
  <Input
    onChange={value =>
      props.setValue(props.field.path, Number(value))
    }
    value={props.value || ''}
    label={props.field.title}
    type="number"
  />
);

export const DateInput = (props: InputProps) => (
  <Input
    onChange={value => props.setValue(props.field.path, value)}
    value={props.value || ''}
    label={props.field.title}
    type="date"
    required={props.field.required}
  />
);

const LocationInput = (props: GroupInputProps) => {
  return (
    <LatLngInput
      value={props.value as [number, number]}
      onChange={v => {
        console.log(v);
        if (v[0] !== props.value[0]) {
          props.setValue('latitude', v[0]);
        } else {
          props.setValue('longitude', v[1]);
        }
      }}
    />
  );
};

const TranslatedInput = (props: GroupInputProps) => (
  <Row>
    <For each={props.field.fields}>
    {(field, i) => (
      <Col>
        <Dynamic
          component={inputs._}
          field={{ ...field, title: `${props.field.title} in ${field.title}` }}
          setValue={props.setValue}
          value={props.value[i()]}
        />
      </Col>
    )}
    </For>
  </Row>
);

const UpdateTypeSelect = (props: InputProps) => (
  <Control>
    {props.field.title}:{' '}
    <select
      value={props.value || 'information-update'}
      onChange={(e: any) => props.setValue(props.field.path, e.target.value)}
    >
      <option value="software-update">Software update</option>
      <option value="information-update">Information update</option>
      <option value="bugfix">Bug fix</option>
    </select>
  </Control>
);

export const DayOfWeekSelect = (props: InputProps) => (
  <Control>
    {props.field.title}
    <select
      value={String(props.value) || '0'}
      onChange={(e: any) =>
        props.setValue(props.field.path, Number(e.target.value))
      }
    >
      {[
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      ].map((day, i) => (
        <option value={String(i)}>{day}</option>
      ))}
    </select>
  </Control>
);

const RelationInput = (props: {
  value: any;
  field: RelationField;
  setValue(path: string, value: any): any;
}) => {
  const { value, field, setValue } = props;
  const [state, fetch] = useResource(null, true);

  React.useEffect(() => {
    const model = models.find(m => m.key === props.field.relationKey);
    fetch(api.fetchItems(model));
  }, []);

  if (state.pending) {
    return <span>Loading...</span>;
  }
  return (
    <Control>
      {field.title}
      <select
        value={value || (state.data.length ? state.data[0].id : '')}
        onChange={(e: any) => setValue(field.path, e.target.value)}
      >
        <For each={sortBy(field.relationDisplayField, state.data)}>
          {(item: any) => (
            <option value={item.id}>
              {get(field.relationDisplayField, item)}
            </option>
          )}
        </For>
      </select>
    </Control>
  );
};

export const PlainField = (props: InputProps) => (
  <Input
    label={props.field.title}
    onChange={value => props.setValue(props.field.path, value)}
    value={props.value || ''}
    type="text"
  />
);

const OpeningHoursEditor = (props: InputProps) => (
  <OpeningHoursInput
    defaultValue={props.value || props.field.default}
    onChange={change => {
      props.setValue(props.field.path, change);
    }}
  />
);

const EnumInput = (props: InputProps) => (
  <Control>
    {props.field.title}
    <select
      value={props.value || props.field.default}
      onChange={(e: any) => props.setValue(props.field.path, e.target.value)}
    >
      <For each={(props.field as EnumField).values}>
        {(item: string) => <option value={item}>{item}</option>}
      </For>
    </select>
  </Control>
);

const inputs: any = {
  url: UrlInput,
  address: AddressInput,
  menuUrl: MenuUrlInput,
  regExp: RegExpInput,
  boolean: BooleanInput,
  location: LocationInput,
  number: NumericInput,
  translated: TranslatedInput,
  updateType: UpdateTypeSelect,
  relation: RelationInput,
  date: DateInput,
  dayOfWeek: DayOfWeekSelect,
  openingHours: OpeningHoursEditor,
  enum: EnumInput,
  _: PlainField
};

export default inputs;

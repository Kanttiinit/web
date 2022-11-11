import { For } from "solid-js";
import * as React from 'react';

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
import Input from "../components/Input";
import format from "date-fns/format";

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

const UrlInput = (props: InputProps) => (
  <>
    <Input
      label={props.field.title}
      onChange={(e: any) => props.setValue(props.field.path, e.target.value)}
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
      onChange={(e: any) => props.setValue(props.field.path, e.target.value)}
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
      onChange={(e: any) => props.setValue(props.field.path, e.target.value)}
      value={props.value || ''}
      label={props.field.title}
      type="text"
    />
  );
}

const RegExpInput = (props: InputProps) => {
  const { field, value, setValue } = props;
  const [test, setTest] = React.useState('');
  const match = !!test.match(new RegExp(value));
  return (
    <Grid container spacing={6}>
      <Grid item sm>
        <Input
          label={field.title}
          onChange={(e: any) => setValue(field.path, e.target.value)}
          value={value || ''}
          type="text"
        />
      </Grid>
      <Grid item sm>
        <Input
          label="Test value"
          value={test}
          error={!match}
          onChange={(e: any) => setTest(e.target.value)}
          helperText={
            match
              ? 'The regexp matches this value.'
              : 'The regexp does not match this value.'
          }
        />
      </Grid>
    </Grid>
  );
};

export const BooleanInput = (props: InputProps) => (
  <FormControlLabel
    control={
      <Switch
        checked={props.value || false}
        onChange={(e: any) => props.setValue(props.field.path, e.target.checked)}
      />
    }
    label={props.field.title}
  />
);

const NumericInput = (props: InputProps) => (
  <Input
    onChange={(e: any) => props.setValue(props.field.path, Number(e.target.value))}
    value={props.value || ''}
    label={props.field.title}
    type="number"
  />
);

export const DateInput = (props: InputProps) => (
  <Input
    onChange={(e: any) => props.setValue(props.field.path, e.target.value)}
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
  <Grid container spacing={6}>
    {props.field.fields.map((field, i) => (
      <Grid key={i} item md>
        {React.createElement(inputs[props.field.type] || inputs._, {
          field: { ...field, title: `${props.field.title} in ${field.title}` },
          setValue: props.setValue,
          value: props.value[i]
        })}
      </Grid>
    ))}
  </Grid>
);

const UpdateTypeSelect = (props: InputProps) => (
  <FormControl fullWidth>
    <InputLabel>{props.field.title}</InputLabel>
    <select
      value={props.value || 'information-update'}
      onChange={(e: any) => props.setValue(props.field.path, e.target.value)}
    >
      <option value="software-update">Software update</option>
      <option value="information-update">Information update</option>
      <option value="bugfix">Bug fix</option>
    </select>
  </FormControl>
);

export const DayOfWeekSelect = (props: InputProps) => (
  <FormControl fullWidth>
    <InputLabel>{props.field.title}</InputLabel>
    <select
      value={String(props.value) || '0'}
      onChange={(e: any) => props.setValue(props.field.path, Number(e.target.value))}
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
        <option value={String(i)}>
          {day}
        </option>
      ))}
    </select>
  </FormControl>
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
    <FormControl fullWidth>
      <InputLabel>{field.title}</InputLabel>
      <select
        value={value || (state.data.length ? state.data[0].id : '')}
        onChange={e => setValue(field.path, e.target.value)}
      >
        <For each={sortBy(field.relationDisplayField, state.data)}>{(item: any) => (
          <option value={item.id}>
            {get(field.relationDisplayField, item)}
          </option>
        )}</For>
      </select>
    </FormControl>
  );
};

export const PlainField = (props: InputProps) => (
  <Input
    label={props.field.title}
    onChange={(e: any) => props.setValue(props.field.path, e.target.value)}
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
  <FormControl fullWidth>
    <InputLabel>{props.field.title}</InputLabel>
    <select
      value={props.value || props.field.default}
      onChange={(e: any) => props.setValue(props.field.path, e.target.value)}
    >
      <For each={(props.field as EnumField).values}>{(item: string) => (
        <option value={item}>
          {item}
        </option>
      )}</For>
    </select>
  </FormControl>
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

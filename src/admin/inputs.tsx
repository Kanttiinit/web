import { For } from "solid-js";
/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import format from 'date-fns/format';
import * as get from 'lodash/fp/get';
import * as sortBy from 'lodash/fp/sortBy';
import * as React from 'react';

import LatLngInput from '../components/LatLngInput';
import OpeningHoursInput from '../components/OpeningHoursInput';
import useResource from '../src/utils/useResource';
import * as api from './api';
import models from './models';
import {
  EnumField,
  ModelField,
  ModelFieldGroup,
  RelationField
} from './models';

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

const UrlInput = (props) => (
  <TextField
    fullWidth
    label={props.field.title}
    onChange={e => props.setValue(props.field.path, e.target.value)}
    value={props.value || ''}
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <Button size="small" target="_blank" href={props.value}>
            Open
          </Button>
        </InputAdornment>
      )
    }}
    type="text"
  />
);

const MenuUrlInput = (props) => {
  const now = new Date();
  const link =
    props.value &&
    props.value
      .replace('%year%', format(now, 'yyyy'))
      .replace('%month%', format(now, 'mm'))
      .replace('%day%', format(now, 'dd'));
  return (
    <TextField
      fullWidth
      onChange={e => props.setValue(props.field.path, e.target.value)}
      value={props.value || ''}
      type="text"
      label={props.field.title}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Button target="_blank" href={link} size="small">
              Open
            </Button>
          </InputAdornment>
        )
      }}
    />
  );
};

class AddressInput extends React.PureComponent {
  props: InputProps;

  render() {
    const { value, setValue, field } = this.props;

    return (
      <TextField
        fullWidth
        onChange={e => setValue(field.path, e.target.value)}
        value={value || ''}
        label={field.title}
        type="text"
      />
    );
  }
}

const RegExpInput = (props: InputProps) => {
  const { field, value, setValue } = props;
  const [test, setTest] = React.useState('');
  const match = !!test.match(new RegExp(value));
  return (
    <Grid container spacing={6}>
      <Grid item sm>
        <TextField
          fullWidth
          label={field.title}
          onChange={e => setValue(field.path, e.target.value)}
          value={value || ''}
          type="text"
        />
      </Grid>
      <Grid item sm>
        <TextField
          fullWidth
          label="Test value"
          value={test}
          error={!match}
          onChange={e => setTest(e.target.value)}
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

export const BooleanInput = (props) => (
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

const NumericInput = (props) => (
  <TextField
    fullWidth
    onChange={e => props.setValue(props.field.path, Number(e.target.value))}
    value={props.value || ''}
    label={props.field.title}
    type="number"
  />
);

export const DateInput = (props) => (
  <TextField
    fullWidth
    onChange={e => props.setValue(props.field.path, e.target.value)}
    value={props.value || ''}
    label={props.field.title}
    type="date"
    InputLabelProps={{ shrink: true }}
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
        {React.createElement(inputs[field.type] || inputs._, {
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
    <Select
      value={props.value || 'information-update'}
      onChange={e => props.setValue(props.field.path, e.target.value)}
    >
      <MenuItem value="software-update">Software update</MenuItem>
      <MenuItem value="information-update">Information update</MenuItem>
      <MenuItem value="bugfix">Bug fix</MenuItem>
    </Select>
  </FormControl>
);

export const DayOfWeekSelect = (props: InputProps) => (
  <FormControl fullWidth>
    <InputLabel>{props.field.title}</InputLabel>
    <Select
      value={String(props.value) || '0'}
      onChange={e => props.setValue(props.field.path, Number(e.target.value))}
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
        <MenuItem key={i} value={String(i)}>
          {day}
        </MenuItem>
      ))}
    </Select>
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
      <Select
        value={value || (state.data.length ? state.data[0].id : '')}
        onChange={e => setValue(field.path, e.target.value)}
      >
        <For each={sortBy(field.relationDisplayField, state.data)}>{(item: any) => (
          <MenuItem key={item.id} value={item.id}>
            {get(field.relationDisplayField, item)}
          </MenuItem>
        )}</For>
      </Select>
    </FormControl>
  );
};

export const PlainField = (props) => (
  <TextField
    fullWidth
    label={props.field.title}
    onChange={e => props.setValue(props.field.path, e.target.value)}
    value={props.value || ''}
    type="text"
  />
);

const OpeningHoursEditor = (props) => (
  <OpeningHoursInput
    defaultValue={props.value || props.field.default}
    onChange={change => {
      props.setValue(props.field.path, change);
    }}
  />
);

const EnumInput = (props) => (
  <FormControl fullWidth>
    <InputLabel>{props.field.title}</InputLabel>
    <Select
      value={props.value || props.field.default}
      onChange={e => props.setValue(props.field.path, e.target.value)}
    >
      <For each={(props.field as EnumField).values}>{(item: string) => (
        <MenuItem key={item} value={item}>
          {item}
        </MenuItem>
      )}</For>
    </Select>
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

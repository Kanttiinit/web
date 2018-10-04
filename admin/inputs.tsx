import * as React from 'react';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import MaskedInput from 'react-text-mask';
import * as get from 'lodash/fp/get';
import * as sortBy from 'lodash/fp/sortBy';
import * as setIsoDay from 'date-fns/set_iso_day';
import * as format from 'date-fns/format';
import PigeonMap from 'pigeon-maps';
import Marker from 'pigeon-marker';

import * as api from './api';
import models from './models';
import { ModelField, ModelFieldGroup, RelationField } from './models';

type InputProps = {
  value: any;
  field: ModelField;
  setValue(path: string, value: any): any;
};

type GroupInputProps = {
  value: Array<any>;
  field: ModelFieldGroup;
  setValue(path: string, value: any): any;
};

const UrlInput = ({ value, setValue, field }: InputProps) => (
  <TextField
    fullWidth
    label={field.title}
    onChange={e => setValue(field.path, e.target.value)}
    value={value || ''}
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <Button size="small" target="_blank" href={value}>
            Open
          </Button>
        </InputAdornment>
      )
    }}
    type="text"
  />
);

const MenuUrlInput = ({ value, setValue, field }: InputProps) => {
  const now = new Date();
  const link =
    value &&
    value
      .replace('%year%', format(now, 'YYYY'))
      .replace('%month%', format(now, 'MM'))
      .replace('%day%', format(now, 'DD'));
  return (
    <TextField
      fullWidth
      onChange={e => setValue(field.path, e.target.value)}
      value={value || ''}
      type="text"
      label={field.title}
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

class RegExpInput extends React.PureComponent {
  props: InputProps;
  state = { test: '' };

  render() {
    const { field, value, setValue } = this.props;
    const { test } = this.state;
    const match = !!test.match(new RegExp(value));
    return (
      <Grid container spacing={24}>
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
            onChange={e => this.setState({ test: e.target.value })}
            helperText={
              match
                ? 'The regexp matches this value.'
                : 'The regexp does not match this value.'
            }
          />
        </Grid>
      </Grid>
    );
  }
}

export const BooleanInput = ({ value, setValue, field }: InputProps) => (
  <FormControlLabel
    control={
      <Switch
        checked={value || false}
        onChange={(e: any) => setValue(field.path, e.target.checked)}
      />
    }
    label={field.title}
  />
);

const NumericInput = ({ value, setValue, field }: InputProps) => (
  <TextField
    fullWidth
    onChange={e => setValue(field.path, Number(e.target.value))}
    value={value || ''}
    label={field.title}
    type="number"
  />
);

export const DateInput = ({ value, setValue, field }: InputProps) => (
  <TextField
    fullWidth
    onChange={e => setValue(field.path, e.target.value)}
    value={value || ''}
    label={field.title}
    type="date"
    InputLabelProps={{ shrink: true }}
    required={field.required}
  />
);

const Map = (props: any) => {
  const onChange = ({ latLng }: { latLng: [number, number] }) =>
    props.onChange(latLng[0], latLng[1]);
  return (
    <PigeonMap
      onClick={onChange}
      defaultCenter={[props.latitude || 60.1705, props.longitude || 24.9414]}
      defaultZoom={14}
    >
      {props.latitude &&
        props.longitude && (
          <Marker anchor={[props.latitude, props.longitude]} />
        )}
    </PigeonMap>
  );
};

const LocationInput = (props: GroupInputProps) => (
  <FormControl fullWidth>
    <FormGroup>
      <Grid container spacing={24}>
        <Grid item xs>
          <NumericInput
            setValue={(f, v) => props.setValue(f, v)}
            value={props.value[0]}
            field={props.field.fields[0]}
          />
        </Grid>
        <Grid item xs>
          <NumericInput
            setValue={(f, v) => props.setValue(f, v)}
            value={props.value[1]}
            field={props.field.fields[1]}
          />
        </Grid>
      </Grid>
      <br />
      <div style={{ height: 200 }}>
        <Map
          latitude={props.value[0]}
          longitude={props.value[1]}
          onChange={(lat: number, lon: number) =>
            props.setValue('latitude', lat) || props.setValue('longitude', lon)
          }
        />
      </div>
    </FormGroup>
  </FormControl>
);

const TranslatedInput = (props: GroupInputProps) => (
  <Grid container spacing={24}>
    {props.field.fields.map((field, i) => (
      <Grid key={i} item md>
        {React.createElement(inputs[field.type] || inputs._, {
          value: props.value[i],
          setValue: props.setValue,
          field: { ...field, title: `${props.field.title} in ${field.title}` }
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

class RelationInput extends React.PureComponent {
  props: {
    value: any;
    field: RelationField;
    setValue(path: string, value: any): any;
  };

  state: {
    items?: Array<any>;
    loading?: boolean;
  } = {
    loading: true
  };

  async fetchItems() {
    const model = models.find(m => m.key === this.props.field.relationKey);
    this.setState({ loading: true });
    this.setState({
      items: await api.fetchItems(model),
      loading: false
    });
  }

  componentDidMount() {
    this.fetchItems();
  }

  render() {
    const { value, field, setValue } = this.props;
    const { items, loading } = this.state;
    if (loading) {
      return <span>Loading...</span>;
    }
    return (
      <FormControl fullWidth>
        <InputLabel>{field.title}</InputLabel>
        <Select
          value={value || (items.length ? items[0].id : '')}
          onChange={e => setValue(field.path, e.target.value)}
        >
          {sortBy(field.relationDisplayField, items).map((item: any) => (
            <MenuItem key={item.id} value={item.id}>
              {get(field.relationDisplayField, item)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }
}

export const PlainField = ({ value, field, setValue }: InputProps) => (
  <TextField
    fullWidth
    label={field.title}
    onChange={e => setValue(field.path, e.target.value)}
    value={value || ''}
    type="text"
  />
);

type OpeningHoursEditorState = {
  hours: Array<[number, number] | null>;
};

class OpeningHoursEditor extends React.PureComponent<
  InputProps,
  OpeningHoursEditorState
> {
  state: OpeningHoursEditorState = { hours: [] };
  static getDerivedStateFromProps(
    props: InputProps,
    state: OpeningHoursEditorState
  ) {
    if (!state.hours.length || state.hours.every(h => h === null)) {
      return { hours: props.value || props.field.default };
    }
    return null;
  }

  onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const [open, close] = target.value.split(' – ');
    this.setState(state => {
      const hours = [...state.hours];
      if (open === 'XX:XX' && close === 'XX:XX') {
        hours[Number(target.name)] = null;
      } else if (!open.includes('X') && !close.includes('X')) {
        hours[Number(target.name)] = [
          Number(open.replace(':', '')),
          Number(close.replace(':', ''))
        ];
      } else {
        return null;
      }
      this.props.setValue(this.props.field.path, hours);
      return { hours };
    });
  };

  serializeHours = (hours: [number, number] | null) =>
    hours ? `${hours[0]} - ${hours[1]}` : '';

  render() {
    const { hours } = this.state;
    return (
      <div>
        {(hours || this.props.field.default).map(
          (hours: [number, number], i: number) => (
            <FormControl margin="dense" key={i}>
              <InputLabel shrink htmlFor={`hours${i}`}>
                {format(setIsoDay(new Date(), i + 1), 'ddd')}
              </InputLabel>
              <Input
                id={`hours${i}`}
                onChange={this.onChange}
                name={String(i)}
                value={this.serializeHours(hours)}
                inputComponent={({ inputRef, ...props }) => (
                  <MaskedInput
                    {...props}
                    ref={inputRef}
                    mask={[
                      /[0-9]{1,2}/,
                      /[0-9]{1,2}/,
                      ':',
                      /[0-9]{1,2}/,
                      /[0-9]{1,2}/,
                      ' ',
                      '–',
                      ' ',
                      /[0-9]{1,2}/,
                      /[0-9]{1,2}/,
                      ':',
                      /[0-9]{1,2}/,
                      /[0-9]{1,2}/
                    ]}
                    showMask
                    placeholderChar="X"
                  />
                )}
              />
            </FormControl>
          )
        )}
      </div>
    );
  }
}

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
  _: PlainField
};

export default inputs;

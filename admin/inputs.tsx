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
import { withGoogleMap, Marker, GoogleMap } from 'react-google-maps';
import * as moment from 'moment';
import * as get from 'lodash/fp/get';
import * as sortBy from 'lodash/fp/sortBy';

import * as api from './api';
import models from './models';
import { ModelField, ModelFieldGroup, RelationField } from './models';
import { showMessage } from './index';

declare var google: any;

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
  const now = moment();
  const link =
    value &&
    value
      .replace('%year%', now.format('YYYY'))
      .replace('%month%', now.format('MM'))
      .replace('%day%', now.format('DD'));
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

  state: { loading: boolean } = { loading: false };

  geocode = (address, setValue) => () => {
    const geocoder = new google.maps.Geocoder();
    this.setState({ loading: true });
    geocoder.geocode({ address }, results => {
      if (results.length) {
        const { geometry } = results[0];
        setValue('latitude', geometry.location.lat());
        setValue('longitude', geometry.location.lng());
      } else {
        showMessage('There was an error geocoding.');
      }
      this.setState({ loading: false });
    });
  };

  render() {
    const { value, setValue, field } = this.props;
    const { loading } = this.state;

    return (
      <TextField
        fullWidth
        onChange={e => setValue(field.path, e.target.value)}
        value={value || ''}
        label={field.title}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Button
                size="small"
                disabled={loading}
                onClick={this.geocode(value, setValue)}
              >
                Geocode
              </Button>
            </InputAdornment>
          )
        }}
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

const BooleanInput = ({ value, setValue, field }: InputProps) => (
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

const DateInput = ({ value, setValue, field }: InputProps) => (
  <TextField
    fullWidth
    onChange={e => setValue(field.path, e.target.value)}
    value={value || ''}
    label={field.title}
    type="date"
  />
);

const Map = withGoogleMap((props: any) => {
  const onChange = ({ latLng }) => props.onChange(latLng.lat(), latLng.lng());
  return (
    <GoogleMap
      onDblClick={onChange}
      defaultCenter={
        new google.maps.LatLng(
          props.latitude || 60.1705,
          props.longitude || 24.9414
        )
      }
      defaultZoom={14}
    >
      {props.latitude &&
        props.longitude && (
          <Marker
            draggable
            onDragEnd={onChange}
            position={new google.maps.LatLng(props.latitude, props.longitude)}
          />
        )}
    </GoogleMap>
  );
});

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
      <Map
        mapElement={<div style={{ height: 200 }} />}
        containerElement={<div />}
        latitude={props.value[0]}
        longitude={props.value[1]}
        onChange={(lat, lon) =>
          props.setValue('latitude', lat) || props.setValue('longitude', lon)
        }
      />
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

const DayOfWeekSelect = (props: InputProps) => (
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
          {sortBy(field.relationDisplayField, items).map(item => (
            <MenuItem key={item.id} value={item.id}>
              {get(field.relationDisplayField, item)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
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
  _: ({ value, field, setValue }: InputProps) => (
    <TextField
      fullWidth
      label={field.title}
      onChange={e => setValue(field.path, e.target.value)}
      value={value || ''}
      type="text"
    />
  )
};

export default inputs;

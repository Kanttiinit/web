/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ModelField {
  type?:
    | 'menuUrl'
    | 'updateType'
    | 'url'
    | 'number'
    | 'boolean'
    | 'address'
    | 'regExp'
    | 'date'
    | 'text'
    | 'dayOfWeek'
    | 'enum'
    | 'openingHours';
  path: string;
  title: string;
  default?: any;
  required?: boolean;
}

export interface EnumField extends ModelField {
  type: 'enum';
  values: string[];
}

export interface ModelFieldGroup {
  type: 'translated' | 'location';
  title: string;
  fields: ModelField[];
}

export interface RelationField {
  type: 'relation';
  title: string;
  path: string;
  relationKey: string;
  relationDisplayField: string;
}

export type Field = ModelField | EnumField | ModelFieldGroup | RelationField;

export interface Model {
  name: string;
  key: string;
  tableFields: { key: string; name: string }[];
  fields: Field[];
  defaultSort?: string;
}

const models: Model[] = [
  {
    name: 'Areas',
    key: 'areas',
    defaultSort: 'name_i18n.fi',
    tableFields: [
      { key: 'id', name: 'ID' },
      { key: 'name_i18n.fi', name: 'Name' },
      { key: 'hidden', name: 'Hidden' },
    ],
    fields: [
      {
        type: 'translated',
        title: 'Name',
        fields: [
          { path: 'name_i18n.fi', title: 'Finnish' },
          { path: 'name_i18n.en', title: 'English' },
        ],
      },
      {
        type: 'number',
        title: 'Location Radius',
        path: 'locationRadius',
        default: 2,
      },
      {
        type: 'location',
        title: 'Location',
        fields: [
          {
            path: 'latitude',
            default: 60.123,
            title: 'Latitude',
            type: 'number',
          },
          {
            path: 'longitude',
            default: 24.123,
            title: 'Longitude',
            type: 'number',
          },
        ],
      },
      {
        type: 'boolean',
        path: 'hidden',
        title: 'Hidden',
        default: false,
      },
    ],
  },
  {
    name: 'Restaurants',
    key: 'restaurants',
    defaultSort: 'name_i18n.fi',
    tableFields: [
      { key: 'id', name: 'ID' },
      { key: 'AreaId', name: 'Area ID' },
      { key: 'name_i18n.fi', name: 'Name' },
      { key: 'address', name: 'Address' },
      { key: 'hidden', name: 'Hidden' },
      { key: 'url', name: 'URL' },
    ],
    fields: [
      {
        type: 'translated',
        title: 'Name',
        fields: [
          { path: 'name_i18n.fi', title: 'Finnish' },
          { path: 'name_i18n.en', title: 'English' },
        ],
      },
      {
        path: 'priceCategory',
        type: 'enum',
        title: 'Price Category',
        values: ['student', 'regular', 'studentPremium'],
        default: 'student',
      },
      {
        path: 'openingHours',
        title: 'Opening Hours',
        type: 'openingHours',
        default: [null, null, null, null, null, null, null],
      },
      { path: 'url', title: 'URL', type: 'url' },
      { path: 'menuUrl', title: 'Menu URL', type: 'menuUrl' },
      {
        type: 'location',
        title: 'Location',
        fields: [
          {
            path: 'latitude',
            default: 60.123,
            title: 'Latitude',
            type: 'number',
          },
          {
            path: 'longitude',
            default: 24.123,
            title: 'Longitude',
            type: 'number',
          },
        ],
      },
      { path: 'address', title: 'Address', type: 'address' },
      {
        path: 'AreaId',
        title: 'Area ID',
        type: 'relation',
        relationKey: 'areas',
        relationDisplayField: 'name_i18n.fi',
      },
      { path: 'hidden', title: 'Hidden', type: 'boolean' },
    ],
  },
  {
    name: 'Favorites',
    key: 'favorites',
    defaultSort: 'name_i18n.fi',
    tableFields: [
      { key: 'id', name: 'ID' },
      { key: 'name_i18n.fi', name: 'Name' },
      { key: 'regexp', name: 'Regular Expression' },
    ],
    fields: [
      {
        type: 'translated',
        title: 'Name',
        fields: [
          { path: 'name_i18n.fi', title: 'Finnish' },
          { path: 'name_i18n.en', title: 'English' },
        ],
      },
      { type: 'regExp', path: 'regexp', title: 'Regular Expression' },
    ],
  },
  {
    name: 'Updates',
    key: 'updates',
    defaultSort: 'createdAt',
    tableFields: [
      { key: 'id', name: 'ID' },
      { key: 'createdAt', name: 'Created at' },
      { key: 'type', name: 'Type' },
      { key: 'title', name: 'Title' },
    ],
    fields: [
      { path: 'type', title: 'Type', type: 'updateType' },
      { path: 'title', title: 'Title' },
      { path: 'description', title: 'Description' },
    ],
  },
];

export default models;

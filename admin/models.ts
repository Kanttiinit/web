export interface ModelField {
  type?: 'menuUrl' | 'url' | 'number' | 'boolean' | 'address' | 'openingHours' | 'regExp',
  path: string,
  title: string,
  default?: any
}

export interface FieldGroup {
  type: 'translated' | 'location',
  title: string,
  fields: Array<ModelField>
}

export type Field = ModelField | FieldGroup

export interface Model {
  name: string,
  key: string,
  tableFields: Array<{key: string, name: string, width?: number}>,
  fields: Array<Field>
}

const models: Array<Model> = [
  {
    name: 'Areas',
    key: 'areas',
    tableFields: [
      {key: 'id', name: 'ID', width: 50},
      {key: 'name_i18n.fi', name: 'Name', width: 200}
    ],
    fields: [
      {
        type: 'translated',
        title: 'Name',
        fields: [
          {path: 'name_i18n.fi', title: 'Finnish'},
          {path: 'name_i18n.en', title: 'English'}
        ]
      },
      {
        type: 'menuUrl',
        title: 'Image URL',
        path: 'imageUrl',
        default: '' 
      },
      {
        type: 'number',
        title: 'Location Radius',
        path: 'locationRadius',
        default: 2
      },
      {
        type: 'location',
        title: 'Location',
        fields: [
          {path: 'latitude', title: 'Latitude', type: 'number'},
          {path: 'longitude', title: 'Longitude', type: 'number'}
        ]
      },
      {
        type: 'boolean',
        path: 'hidden',
        title: 'Hidden',
        default: false
      }
    ]
  },
  {
    name: 'Restaurants',
    key: 'restaurants',
    tableFields: [
      {key: 'id', name: 'ID', width: 50},
      {key: 'AreaId', name: 'Area ID', width: 50},
      {key: 'name_i18n.fi', name: 'Name', width: 200},
      {key: 'address', name: 'Address', width: 200},
      {key: 'url', name: 'URL', width: 200}
    ],
    fields: [
      {
        type: 'translated',
        title: 'Name',
        fields: [
          {path: 'name_i18n.fi', title: 'Finnish'},
          {path: 'name_i18n.en', title: 'English'}
        ]
      },
      {path: 'type', title: 'Type'},
      {path: 'url', title: 'URL', type: 'url'},
      {path: 'menuUrl', title: 'Menu URL', type: 'menuUrl'},
      {
        type: 'location',
        title: 'Location',
        fields: [
          {path: 'latitude', title: 'Latitude', type: 'number'},
          {path: 'longitude', title: 'Longitude', type: 'number'}
        ]
      },
      {path: 'address', title: 'Address', type: 'address'},
      {path: 'openingHours', title: 'Opening Hours', type: 'openingHours', default: [null, null, null, null, null, null, null]},
      {path: 'AreaId', title: 'Area ID', type: 'number'},      
      {path: 'hidden', title: 'Hidden', type: 'boolean'}
    ]
  },
  {
    name: 'Favorites',
    key: 'favorites',
    tableFields: [
      {key: 'id', name: 'ID', width: 50},
      {key: 'name_i18n.fi', name: 'Name', width: 100},
      {key: 'regexp', name: 'Regular Expression', width: 300}
    ],
    fields: [
      {
        type: 'translated',
        title: 'Name',
        fields: [
          {path: 'name_i18n.fi', title: 'Finnish'},
          {path: 'name_i18n.en', title: 'English'}
        ]
      },
      {type: 'regExp', path: 'regexp', title: 'Regular Expression'},
      {path: 'icon', title: 'Icon'}
    ]
  },
  {
    name: 'Updates',
    key: 'updates',
    tableFields: [
      {key: 'id', name: 'ID'},
      {key: 'type', name: 'Type'},
      {key: 'description', name: 'Description'}
    ],
    fields: [
      {path: 'type', title: 'Type'},
      {path: 'description', title: 'Description'}
    ]
  }
]

export default models
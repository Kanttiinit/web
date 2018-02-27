export interface Model {
  name: string,
  key: string,
  tableFields: Array<{key: string, name: string, width?: number}>,
  defaultFields: any
}

export default [
  {
    name: 'Areas',
    key: 'areas',
    tableFields: [
      {key: 'id', name: 'ID', width: 50},
      {key: 'name_i18n.fi', name: 'Name', width: 200}
    ],
    defaultFields: {
      name_i18n: {
        fi: '',
        en: ''
      },
      image: '',
      locationRadius: 0,
      latitude: 60.000000,
      longitude: 24.000000,
    }
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
    defaultFields: {
      name_i18n: {
        fi: '',
        en: ''
      },
      type: '',
      url: '',
      menuUrl: '',
      latitude: 60.000000,
      longitude: 24.000000,
      address: '',
      openingHours: [],
      AreaId: 0
    }
  },
  {
    name: 'Favorites',
    key: 'favorites',
    tableFields: [
      {key: 'id', name: 'ID', width: 50},
      {key: 'name_i18n.fi', name: 'Name', width: 100},
      {key: 'regexp', name: 'Regular Expression', width: 300}
    ],
    defaultFields: {
      name_i18n: {
        fi: '',
        en: ''
      },
      regexp: '',
      icon: ''
    }
  },
  {
    name: 'Updates',
    key: 'updates',
    tableFields: [
      {key: 'id', name: 'ID'},
      {key: 'type', name: 'Type'},
      {key: 'description', name: 'Description'}
    ],
    defaultFields: {
      type: '',
      description: ''
    }
  }
] as Array<Model>

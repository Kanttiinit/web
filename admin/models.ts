export interface Model {
  name: string,
  tableFields: Array<{key: string, name: string}>,
  defaultFields: any
}

export default [
  {
    name: 'Areas',
    tableFields: [
      {key: 'id', name: 'ID'},
      {key: 'name_i18n.fi', name: 'Name'}
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
    tableFields: [
      {key: 'id', name: 'ID'},
      {key: 'AreaId', name: 'Area ID'},
      {key: 'name_i18n.fi', name: 'Name'}
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
    tableFields: [
      {key: 'id', name: 'ID'},
      {key: 'name_i18n.fi', name: 'Name'},
      {key: 'regexp', name: 'Regular Expression'}
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
]

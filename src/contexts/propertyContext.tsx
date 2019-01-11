import * as without from 'lodash/without';
import * as React from 'react';

import * as translations from '../utils/translations';
import usePersistedState from '../utils/usePersistedState';

interface PropertyContext {
  properties: string[];
  toggleProperty(property: string): void;
  isDesiredProperty(propertyKey: string): boolean;
  isPropertySelected(propertyKey: string): boolean;
  isUndesiredProperty(propertyKey: string): boolean;
}

const propertyContext = React.createContext<PropertyContext>({} as any);

function toggleInArray<T>(array: T[], item: T): T[] {
  if (array.indexOf(item) === -1) {
    return array.concat(item);
  } else {
    return without(array, item);
  }
}

function getProperty(propertyKey: string) {
  return translations.properties.find(p => p.key === propertyKey);
}

export const PropertyContextProvider = (props: {
  children: React.ReactNode;
}) => {
  const [properties, setProperties] = usePersistedState<string[]>(
    'properties',
    []
  );

  const isPropertySelected = (propertyKey: string) =>
    properties.some(p => p.toLowerCase() === propertyKey.toLowerCase());

  const isDesiredProperty = (propertyKey: string) => {
    const property = getProperty(propertyKey);
    if (property && property.desired) {
      return isPropertySelected(propertyKey);
    }
    return false;
  };

  const isUndesiredProperty = (propertyKey: string) => {
    const property = getProperty(propertyKey);
    if (property && !property.desired) {
      return isPropertySelected(propertyKey);
    }
    return false;
  };

  const toggleProperty = (property: string) => {
    setProperties(toggleInArray(properties, property));
  };

  const context = React.useMemo(
    () => ({
      isDesiredProperty,
      isPropertySelected,
      isUndesiredProperty,
      properties,
      toggleProperty
    }),
    [properties]
  );

  return (
    <propertyContext.Provider value={context}>
      {props.children}
    </propertyContext.Provider>
  );
};

export default propertyContext;

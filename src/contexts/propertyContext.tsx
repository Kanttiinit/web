import * as React from 'react';

import * as translations from '../utils/translations';
import useArrayState from '../utils/useArrayState';
import usePersistedState from '../utils/usePersistedState';

interface PropertyContext {
  properties: string[];
  toggleProperty(property: string): void;
  isDesiredProperty(propertyKey: string): boolean;
  isPropertySelected(propertyKey: string): boolean;
  isUndesiredProperty(propertyKey: string): boolean;
}

const propertyContext = React.createContext<PropertyContext>({} as any);

function getProperty(propertyKey: string) {
  return translations.properties.find(p => p.key === propertyKey);
}

export const PropertyContextProvider = (props: {
  children: React.ReactNode;
}) => {
  const [properties, propertiesActions] = useArrayState(
    usePersistedState<string[]>('properties', [])
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

  const context = React.useMemo(
    () => ({
      isDesiredProperty,
      isPropertySelected,
      isUndesiredProperty,
      properties,
      toggleProperty: propertiesActions.toggle
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

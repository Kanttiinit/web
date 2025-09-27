export interface AddressData {
  display_name: string;
  address?: {
    house_number?: string;
    road?: string;
    postcode?: string;
    city?: string;
    town?: string;
    municipality?: string;
    suburb?: string;
    neighbourhood?: string;
  };
}

export const formatAddress = (data: AddressData): string => {
  if (!data.address) {
    return data.display_name;
  }

  const addr = data.address;
  const parts: string[] = [];

  // Street and house number
  if (addr.road) {
    if (addr.house_number) {
      parts.push(`${addr.road} ${addr.house_number}`);
    } else {
      parts.push(addr.road);
    }
  }

  // Postal code and city
  const cityName = addr.city || addr.town || addr.municipality || 'Helsinki';
  if (addr.postcode && cityName) {
    parts.push(`${addr.postcode} ${cityName}`);
  } else if (cityName) {
    parts.push(cityName);
  }

  return parts.length > 0 ? parts.join(', ') : data.display_name;
};
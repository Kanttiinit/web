import { createEffect, createSignal, For, Show } from 'solid-js';
import { styled } from 'solid-styled-components';
import Input from './Input';

interface NominatimResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  boundingbox: string[];
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
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

interface Props {
  value: string;
  label: string;
  onChange: (address: string) => void;
  onCoordinatesChange?: (lat: number, lng: number) => void;
  placeholder?: string;
}

const Container = styled.div`
  position: relative;
`;

const ResultsList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ccc;
  border-top: none;
  border-radius: 0 0 4px 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  margin: 0;
  padding: 0;
  list-style: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ResultItem = styled.li`
  padding: 8px 12px;
  cursor: pointer;
  border-bottom: 1px solid #eee;

  &:hover {
    background-color: #f5f5f5;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const LoadingMessage = styled.div`
  padding: 8px 12px;
  color: #666;
  font-style: italic;
`;

const AddressSearchInput = (props: Props) => {
  const [searchQuery, setSearchQuery] = createSignal(props.value);
  const [results, setResults] = createSignal<NominatimResult[]>([]);
  const [loading, setLoading] = createSignal(false);
  const [showResults, setShowResults] = createSignal(false);
  let searchTimeout: ReturnType<typeof setTimeout>;

  const formatAddress = (result: NominatimResult): string => {
    if (!result.address) {
      return result.display_name;
    }

    const addr = result.address;
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

    return parts.length > 0 ? parts.join(', ') : result.display_name;
  };

  const searchAddresses = async (query: string) => {
    if (query.length < 3) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1&countrycodes=fi`
      );

      if (response.ok) {
        const data: NominatimResult[] = await response.json();

        // Deduplicate results based on formatted address
        const uniqueResults: NominatimResult[] = [];
        const seenAddresses = new Set<string>();

        for (const result of data) {
          const formattedAddr = formatAddress(result);
          if (!seenAddresses.has(formattedAddr)) {
            seenAddresses.add(formattedAddr);
            uniqueResults.push(result);
          }
        }

        setResults(uniqueResults);
        setShowResults(true);
      } else {
        console.error('Geocoding request failed:', response.statusText);
        setResults([]);
        setShowResults(false);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      setResults([]);
      setShowResults(false);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = (query: string) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      searchAddresses(query);
    }, 300);
  };

  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    props.onChange(value);
    debouncedSearch(value);
  };

  const selectResult = (result: NominatimResult) => {
    const address = formatAddress(result);
    setSearchQuery(address);
    props.onChange(address);

    if (props.onCoordinatesChange) {
      props.onCoordinatesChange(parseFloat(result.lat), parseFloat(result.lon));
    }

    setShowResults(false);
    setResults([]);
  };

  const handleBlur = () => {
    // Delay hiding results to allow click events
    setTimeout(() => {
      setShowResults(false);
    }, 200);
  };

  createEffect(() => {
    if (props.value !== searchQuery()) {
      setSearchQuery(props.value);
    }
  });

  return (
    <Container>
      <div onBlur={handleBlur}>
        <Input
          label={props.label}
          value={searchQuery()}
          onChange={handleInputChange}
          type="text"
        />
      </div>

      <Show when={showResults() && (results().length > 0 || loading())}>
        <ResultsList>
          <Show when={loading()}>
            <LoadingMessage>Searching...</LoadingMessage>
          </Show>

          <For each={results()}>
            {(result) => (
              <ResultItem onClick={() => selectResult(result)}>
                {formatAddress(result)}
              </ResultItem>
            )}
          </For>

          <Show when={!loading() && results().length === 0}>
            <LoadingMessage>No results found</LoadingMessage>
          </Show>
        </ResultsList>
      </Show>
    </Container>
  );
};

export default AddressSearchInput;
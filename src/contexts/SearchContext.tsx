import { createContext, useContext, useState, type ReactNode } from 'react';

interface SearchContextType {
  searchResults: any[] | null;
  setSearchResults: (results: any[] | null) => void;
  clearSearchResults: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchResults, setSearchResults] = useState<any[] | null>(null);

  const clearSearchResults = () => {
    setSearchResults(null);
  };

  return (
    <SearchContext.Provider value={{ searchResults, setSearchResults, clearSearchResults }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
} 
import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import css from './App.module.css';
import 'modern-normalize';
import NoteList from '../NoteList/NoteList';
import { fetchNotes } from '../../services/noteService';
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import SearchBox from '../SearchBox/SearchBox';
import Loader from '../Loader/Loader';
import Error from '../Error/Error';
import Empty from '../Empty/Emty';

function App() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const perPage = 12;
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['notes', page, query],
    queryFn: () => fetchNotes({ page, perPage, query }),
    placeholderData: keepPreviousData,
  });

  const debouncedSearch = useDebouncedCallback((value: string) => {
    setQuery(value);
    setPage(1);
    console.log(value);
  }, 1000);

  const handleSearchChange = (value: string) => {
    setInputValue(value);
    debouncedSearch(value);
  };

  if (isError) {
    console.error('Error fetching notes:', error);
  }
  if (isLoading) return <Loader />;
  if (isError) return <Error message="Failed to fetch notes" />;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        {/* Компонент SearchBox */}
        <SearchBox value={inputValue} onChange={handleSearchChange} />
        {/*Пагінація*/}
        {data && data.totalPages && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
        {/* Кнопка створення нотатки */}
        <button className={css.button} onClick={() => setIsOpen(true)}>
          Create note +
        </button>
      </header>
      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
      {data?.notes?.length === 0 && <Empty message="No notes found" />}
      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <NoteForm onClose={() => setIsOpen(false)} />
        </Modal>
      )}
    </div>
  );
}

export default App;

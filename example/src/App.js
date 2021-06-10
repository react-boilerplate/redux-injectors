import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './App.css';
import logo from './logo.svg';

import { selectPeople } from './managers/PeopleManager';

export function App() {
  const dispatch = useDispatch();
  const [searchText, setSearchText] = React.useState("");

  React.useEffect(() => {
    dispatch({ type: "LOAD_PEOPLE", searchText });
  }, [dispatch, searchText]);

  const people = useSelector(selectPeople);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <main>
        <label className="App-search">
          <div>Search People</div>
          <input 
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </label>
        <div className="App-searchResults">
          {people.map((person, idx) => (
            <section key={idx}>
              <h2 className="App-person">{person.name}</h2>
            </section>  
          ))}
          {people.length === 0 && <h2 className="App-person" style={{ fontStyle: "italic" }}>No Results</h2>}
        </div>
      </main>
    </div>
  );
}

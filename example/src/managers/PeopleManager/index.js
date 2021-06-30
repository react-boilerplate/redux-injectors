import { createManager } from 'redux-injectors';
import { call, put, takeLatest } from 'redux-saga/effects';

function reducer(initialState = { data: [] }, action) {
  switch (action.type) {
    case "LOADED_PEOPLE":
      return {
        ...initialState,
        data: action.payload.results
      }
  }

  return initialState;
}

function* saga() {
  yield takeLatest('LOAD_PEOPLE', loadPeople)
}

export function* loadPeople(action) {
  const payload = yield call(fetchPeople, action.searchText)
  yield put({ type: 'LOADED_PEOPLE', payload })
}

async function fetchPeople(searchText) {
  const response = await fetch(`https://swapi.dev/api/people/?search=${searchText}`);
  const data = await response.json();

  return data;
}

export const selectPeople = (state) => state.people.data;

export const PeopleManager = createManager({
  name: "PeopleManager",
  key: "people",
  reducer,
  saga,
});

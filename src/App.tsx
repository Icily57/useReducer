import { useReducer } from 'react';
import './App.scss';
import { initialState, Joke } from './InitialState';

type Action = 
  | { type: 'ADD_JOKE', payload: string }
  | { type: 'UPDATE_JOKE_RATE', payload: { id: number, rate: number } }
  | { type: 'UPDATE_JOKE_TEXT', payload: { id: number, text: string } }
  | { type: 'DELETE_JOKE', payload: { id: number } }
  | { type: 'SET_NEW_JOKE', payload: string };

type State = {
  jokes: Joke[];
  newJoke: string;
};

const initialStateReducer: State = {
  jokes: initialState,
  newJoke: '',
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_JOKE':
      const newJoke: Joke = {
        id: state.jokes.length ? Math.max(...state.jokes.map(j => j.id)) + 1 : 1,
        joke: action.payload,
        rate: 0,
      };
      return {
        ...state,
        jokes: [...state.jokes, newJoke],
        newJoke: '',
      };
    case 'UPDATE_JOKE_RATE':
      return {
        ...state,
        jokes: state.jokes.map(joke =>
          joke.id === action.payload.id ? { ...joke, rate: action.payload.rate } : joke
        ),
      };
    case 'UPDATE_JOKE_TEXT':
      return {
        ...state,
        jokes: state.jokes.map(joke =>
          joke.id === action.payload.id ? { ...joke, joke: action.payload.text } : joke
        ),
      };
    case 'DELETE_JOKE':
      return {
        ...state,
        jokes: state.jokes.filter(joke => joke.id !== action.payload.id),
      };
    case 'SET_NEW_JOKE':
      return {
        ...state,
        newJoke: action.payload,
      };
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialStateReducer);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state.newJoke.trim()) {
      dispatch({ type: 'ADD_JOKE', payload: state.newJoke });
    }
  };

  return (
    <div className='container'>
      <h2>Jokes for you 😂</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder='Add a joke'
          value={state.newJoke}
          onChange={(e) => dispatch({ type: 'SET_NEW_JOKE', payload: e.target.value })}
        />
        <button type='submit'>Add Joke</button>
      </form>
      <div className="jokes">
        {state.jokes &&
          state.jokes
            .sort((a, b) => b.rate - a.rate)
            .map((joke) => {
              return (
                <div key={joke.id} className='joke'>
                  <div className='joke-text'>{joke.joke}</div>
                  <div className='text'>{joke.rate}</div>
                  <div className="joke-buttons">
                    <button className='btn' onClick={() => dispatch({ type: 'UPDATE_JOKE_RATE', payload: { id: joke.id, rate: joke.rate + 1 } })}>Like 👍</button>
                    <button className='btn' onClick={() => dispatch({ type: 'UPDATE_JOKE_RATE', payload: { id: joke.id, rate: joke.rate - 1 } })}>Dislike👎</button>
                    <button className='btn' onClick={() => dispatch({ type: 'DELETE_JOKE', payload: { id: joke.id } })}>Delete 🚮</button>
                    <button className='btn' onClick={() => {
                      const newText = prompt('Enter new joke text:', joke.joke);
                      if (newText) {
                        dispatch({ type: 'UPDATE_JOKE_TEXT', payload: { id: joke.id, text: newText } });
                      }
                    }}>Update 🖊</button>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
}

export default App;

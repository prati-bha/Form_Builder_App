 import { createStore, applyMiddleware, compose } from 'redux';
 import { routerMiddleware } from 'connected-react-router';
 import createSagaMiddleware from 'redux-saga';
 import rootSaga from './saga';
 import createReducer from './reducers';
 
 
 export default function configureStore(initialState = {}, history) {
   let composeEnhancers = compose;
 
   const sagaMiddleware = createSagaMiddleware();
   const middleware = [sagaMiddleware, routerMiddleware(history)];
 
   const enhancers = [applyMiddleware(...middleware)];
   const store = createStore(
     createReducer(),
     initialState,
     composeEnhancers(...enhancers),
   );

   sagaMiddleware.run(rootSaga)
   return store;
 }
 
import {applyMiddleware, compose, createStore} from "redux";
import rootReducer from "./reducers";
import { persistStore } from "redux-persist";
import thunk from "redux-thunk";

const middleware = [thunk]

const composeEnhancers =
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;

const enhancer = composeEnhancers(applyMiddleware(...middleware));

export const store = createStore(rootReducer, enhancer);

export const persistor = persistStore(store);

//export default { store, persistor };

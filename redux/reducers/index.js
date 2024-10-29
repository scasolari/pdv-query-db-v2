import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import profile from "@/redux/reducers/token";
import organization from "@/redux/reducers/organization";
import organizations from "@/redux/reducers/organizations";
import database from "@/redux/reducers/database";
import databases from "@/redux/reducers/databases";

// WHITELIST
const persistConfig = {
    key: "root",
    // storage: new CookieStorage(Cookies), //session,
    storage: storage,
    whitelist: ["profile", "organization", "organizations", "database", "databases"]
};

const rootReducer = combineReducers({
    profile: profile,
    organization: organization,
    organizations: organizations,
    database: database,
    databases: databases,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;

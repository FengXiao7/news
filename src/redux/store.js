import { createStore, combineReducers } from 'redux'
import { CollapsedReducer } from './reducer/CollapsedReducer'
import { isLoadingReducer } from './reducer/isLoadingReducer'
import { composeWithDevTools } from 'redux-devtools-extension'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

//持久化配置
const persistConfig = {
    key: '小冯',
    storage,
    blacklist:['isLoadingReducer']
}
// 合并reducer
const reducer = combineReducers({
    CollapsedReducer,
    isLoadingReducer
})
// 改造我们的reducer
const persistedReducer = persistReducer(persistConfig, reducer)

let store = createStore(persistedReducer, composeWithDevTools())
let persistor = persistStore(store)


export  { store, persistor }
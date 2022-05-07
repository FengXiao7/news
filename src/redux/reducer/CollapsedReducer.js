export const CollapsedReducer=(preState={isCollapsed:false},action)=>{
    let {type} = action
    switch (type){
        case 'change_isCollapsed':
            let newState={...preState}
            newState.isCollapsed=!preState.isCollapsed
            return newState
        default:
            return preState
    }
}
export const isLoadingReducer=(preState={isLoading:false},action)=>{
    let {type,payLoad} = action
    switch (type){
        case 'change_isLoading':
            let newState={...preState}
            newState.isLoading=payLoad
            return newState
        default:
            return preState
    }
}
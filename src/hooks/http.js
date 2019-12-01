import {useReducer, useCallback} from 'react';

const initialState = {
    loading: false,
    error: null,
    data: null,
    extra: null,
    identifier: null
};

const httpReducer = (currentHttpState, action) => {
    switch (action.type) {
        case 'SEND':
            return {loading: true, error: null, data: null, extra: null, identifier: action.identifier};
        case 'RESPONSE':
            return {...currentHttpState, loading: false, data: action.responseData, extra: action.extra};
        case 'ERROR':
            return {loading: false, error: action.error};
        case 'CLEAR':
            return initialState;
        default:
            throw new Error('Should not be reached');
    }
};

const useHttp = () => {
    const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);

    const clear = useCallback(() => dispatchHttp({ type: 'CLEAR' }), []);

    const sendRequest = useCallback(async (url, method, body, extra, identifier) => {
        dispatchHttp({type: 'SEND', identifier: identifier});
        try {
            const response = await fetch(url, {
                method: method,
                body: body,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const responseData = await response.json();
            dispatchHttp({type: 'RESPONSE', responseData: responseData, extra: extra});
        } catch (e) {
            dispatchHttp({type: 'ERROR', error: 'Terrible Fail!!'});
        }
    }, []);

    return {
        isLoading: httpState.loading,
        error: httpState.error,
        data: httpState.data,
        sendRequest: sendRequest,
        reqExtra: httpState.extra,
        reqIdentifier: httpState.identifier,
        clear: clear
    }
};

export default useHttp;
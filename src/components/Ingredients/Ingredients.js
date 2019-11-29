import React, {useEffect, useCallback, useReducer, useMemo} from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import Search from './Search';

const ingredientsReducer = (currentIngredients, action) => {
    switch (action.type) {
        case 'SET':
            return action.ingredients;
        case 'ADD':
            return [...currentIngredients, action.ingredient];
        case 'DELETE':
            return currentIngredients.filter(ig => ig.id !== action.id);
        default:
            throw new Error('Should not get there');
    }
};

const httpReducer = (currentHttpState, action) => {
    switch (action.type) {
        case 'SEND':
            return {loading: true, error: null};
        case 'RESPONSE':
            return {...currentHttpState, loading: false};
        case 'ERROR':
            return {loading: false, error: action.error};
        case 'CLEAR':
            return {...currentHttpState, error: null};
        default:
            throw new Error('Should not be reached');
    }
};

function Ingredients() {

    const [ingredients, dispatch] = useReducer(ingredientsReducer, []);
    const [httpState, dispatchHttp] = useReducer(httpReducer, {loading: false, error: null});
    // const [ingredients, setIngredients] = useState([]);
    // const [isLoading, setIsLoading] = useState(false);
    // const [error, setError] = useState();

    // useEffect(() => {
    //
    //     async function fetchData() {
    //         const response = await fetch('https://react-course-hooks.firebaseio.com/ingredients.json');
    //         const responseData = await response.json();
    //         let loadedData = [];
    //         for (let key in responseData) {
    //             loadedData.push({
    //                 id: key,
    //                 ...responseData[key],
    //             })
    //         }
    //
    //         setIngredients(loadedData);
    //     }
    //
    //     fetchData();
    //
    // }, []);

    useEffect(() => {
        console.log('RENDER while ingredient changed');
    }, [ingredients]);


    const filteredIngredient = useCallback((filteredIngredient) => {
        // setIngredients(filteredIngredient);
        dispatch({type: 'SET', ingredients: filteredIngredient})
    }, []);

    const addIngredient = useCallback(async (ingredient) => {

        dispatchHttp({type: 'SEND'});

        // talk to server
        const response = await fetch('https://react-course-hooks.firebaseio.com/ingredients.json', {
            method: 'POST',
            body: JSON.stringify(ingredient),
            headers: {'Content-Type': 'application.json'}
        });
        const responseData = await response.json();
        dispatchHttp({type: 'RESPONSE'});

        // setIngredients(prevIngredients => [
        //     ...prevIngredients,
        //     {
        //         id: responseData.name,
        //         ...ingredient // contain title and amount
        //     }]
        // );
        dispatch({type: 'ADD', ingredient: {id: responseData.name, ...ingredient}})
    }, []);


    const removeIngredient = useCallback(async (idToRemove) => {

        dispatchHttp({type: 'SEND'});

        try {
            await fetch(`https://react-course-hooks.firebaseio.com/ingredients/${idToRemove}.json`, {
                method: 'DELETE',
            });
            dispatchHttp({type: 'RESPONSE'});
            // setIngredients(prevIngredients =>
            //     prevIngredients.filter(ig => ig.id !== idToRemove)
            // )
            dispatch({type: 'DELETE', id: idToRemove});
        } catch (e) {
            // setIsLoading(false);
            // setError(e.message);
            dispatchHttp({type: 'ERROR', error: e});
        }
    }, []);

    const clearError = useCallback(() => {
        dispatchHttp({type: 'CLEAR'});
    });

    const ingredientList = useMemo(() =>
            <IngredientList ingredients={ingredients}
                            onRemoveItem={ingredients}/>,
        [ingredients, ingredients]
    );

    return (
        <div className="App">
            {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}
            <IngredientForm onAddIngredient={addIngredient} loading={httpState.loading}/>

            <section>
                <Search onLoadingIngredient={filteredIngredient}/>
                {ingredientList}
            </section>
        </div>
    );
}

export default Ingredients;

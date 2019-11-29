import React, {useState, useEffect, useCallback, useReducer} from 'react';

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

function Ingredients() {

    const [ingredients, dispatch] = useReducer(ingredientsReducer, []);
    // const [ingredients, setIngredients] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

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

    const addIngredient = async (ingredient) => {

        setIsLoading(true);

        // talk to server
        const response = await fetch('https://react-course-hooks.firebaseio.com/ingredients.json', {
            method: 'POST',
            body: JSON.stringify(ingredient),
            headers: {'Content-Type': 'application.json'}
        });
        const responseData = await response.json();
        setIsLoading(false);

        // setIngredients(prevIngredients => [
        //     ...prevIngredients,
        //     {
        //         id: responseData.name,
        //         ...ingredient // contain title and amount
        //     }]
        // );
        dispatch({type: 'ADD', ingredient: {id: responseData.name, ...ingredient}})
    };

    const removeIngredient = async (idToRemove) => {

        setIsLoading(true);

        try {
            await fetch(`https://react-course-hooks.firebaseio.com/ingredients/${idToRemove}.json`, {
                method: 'DELETE',
            });
            setIsLoading(false);
            // setIngredients(prevIngredients =>
            //     prevIngredients.filter(ig => ig.id !== idToRemove)
            // )
            dispatch({type: 'DELETE', id: idToRemove});
        } catch (e) {
            // setIsLoading(false);
            setError(e.message);
        }
    };

    const clearError = () => {
        setIsLoading(false);
        setError();
    };

    return (
        <div className="App">
            {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
            <IngredientForm onAddIngredient={addIngredient} loading={isLoading}/>

            <section>
                <Search onLoadingIngredient={filteredIngredient}/>
                <IngredientList ingredients={ingredients} onRemoveItem={removeIngredient}/>
            </section>
        </div>
    );
}

export default Ingredients;

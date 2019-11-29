import React, {useState, useEffect, useCallback} from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import Search from './Search';

function Ingredients() {

    const [ingredients, setIngredients] = useState([]);
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
        setIngredients(filteredIngredient);
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

        setIngredients(prevIngredients => [
            ...prevIngredients,
            {
                id: responseData.name,
                ...ingredient // contain title and amount
            }]
        );
    };

    const removeIngredient = async (idToRemove) => {

        setIsLoading(true);

        try {
            await fetch(`https://react-course-hooks.firebaseio.com/ingredients/${idToRemove}.json`, {
                method: 'DELETE',
            });
            setIsLoading(false);
            setIngredients(prevIngredients =>
                prevIngredients.filter(ig => ig.id !== idToRemove)
            )
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

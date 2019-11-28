import React, {useState, useEffect} from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from "./IngredientList";
import Search from './Search';

function Ingredients() {

    const [ingredients, setIngredients] = useState([]);

    useEffect(() => {

        async function fetchData() {
            const response = await fetch('https://react-course-hooks.firebaseio.com/ingredients.json');
            const responseData = await response.json();
            let loadedData = [];
            for (let key in responseData) {
                loadedData.push({
                    id: key,
                    ...responseData[key],
                })
            }

            setIngredients(loadedData);
        }

        fetchData();

    }, []);

    useEffect(() => {
        console.log('RENDER while ingredient changed');
    },[ingredients]);


    const addIngredient = async (ingredient) => {

        // talk to server
        const response = await fetch('https://react-course-hooks.firebaseio.com/ingredients.json', {
            method: 'POST',
            body: JSON.stringify(ingredient),
            headers: {'Content-Type': 'application.json'}
        });
        const responseData = await response.json();

        setIngredients(prevIngredients => [
            ...prevIngredients,
            {
                id: responseData.name,
                ...ingredient // contain title and amount
            }]
        );
    };

    return (
        <div className="App">
            <IngredientForm onAddIngredient={addIngredient}/>

            <section>
                <Search/>
                <IngredientList ingredients={ingredients} onRemoveItem={() => {
                }}/>
            </section>
        </div>
    );
}

export default Ingredients;

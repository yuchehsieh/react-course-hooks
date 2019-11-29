import React, {useState, useEffect, useRef} from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {

    const {onLoadingIngredient} = props;
    const [enteredFilter, setEnteredFilter] = useState('');
    const inputRef = useRef();

    useEffect(() => {

        const timer = setTimeout(() => {

            if(enteredFilter === inputRef.current.value) {

                async function fetchFilteredData() {
                    const query = enteredFilter.length === 0 ? '' : `?orderBy="title"&equalTo="${enteredFilter}"`;
                    const response = await fetch('https://react-course-hooks.firebaseio.com/ingredients.json' + query);
                    const responseData = await response.json();
                    let loadedData = [];
                    for (let key in responseData) {
                        loadedData.push({
                            id: key,
                            ...responseData[key],
                        })
                    }

                    onLoadingIngredient(loadedData);
                }

                fetchFilteredData();
            }

            return () => {
                clearTimeout(timer);
            }

        } , 500)


    }, [enteredFilter, onLoadingIngredient, inputRef]);

    return (
        <section className="search">
            <Card>
                <div className="search-input">
                    <label>Filter by Title</label>
                    <input type="text" value={enteredFilter} ref={inputRef}
                           onChange={e => setEnteredFilter(e.target.value)}/>
                </div>
            </Card>
        </section>
    );
});

export default Search;

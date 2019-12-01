import React, {useState, useEffect, useRef} from 'react';

import Card from '../UI/Card';
import useHttp from "../../hooks/http";
import ErrorModal from "../UI/ErrorModal";
import './Search.css';

const Search = React.memo(props => {

    const {onLoadingIngredient} = props;
    const [enteredFilter, setEnteredFilter] = useState('');
    const inputRef = useRef();
    const {isLoading, data, error, sendRequest, clear} = useHttp();

    useEffect(() => {

        const timer = setTimeout(() => {

            if(enteredFilter === inputRef.current.value) {

                async function fetchFilteredData() {
                    const query = enteredFilter.length === 0 ? '' : `?orderBy="title"&equalTo="${enteredFilter}"`;

                    sendRequest('https://react-course-hooks.firebaseio.com/ingredients.json' + query, 'GET');

                }

                fetchFilteredData();
            }

            return () => {
                clearTimeout(timer);
            }

        } , 500)


    }, [enteredFilter, inputRef, sendRequest]);

    useEffect(() => {
        if(!isLoading && !error && data) {
            let loadedData = [];
            for (let key in data) {
                loadedData.push({
                    id: key,
                    ...data[key],
                })
            }

            onLoadingIngredient(loadedData);
        }
    }, [data, isLoading, error, onLoadingIngredient]);

    return (
        <section className="search">
            {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
            <Card>
                <div className="search-input">
                    <label>Filter by Title</label>
                    {isLoading && <span>Loading...</span>}
                    <input type="text" value={enteredFilter} ref={inputRef}
                           onChange={e => setEnteredFilter(e.target.value)}/>
                </div>
            </Card>
        </section>
    );
});

export default Search;

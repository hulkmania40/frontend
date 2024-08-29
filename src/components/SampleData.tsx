import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SampleData: React.FC = () => {
    const [data, setData] = useState<string>('');

    useEffect(() => {
        axios.get('http://localhost:8000/api/hello/')
            .then(response => {
                setData(response.data.message);
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
            });
    }, []);

    return (
        <div>
            <h1>API Response:</h1>
            <p>{data}</p>
        </div>
    );
};

export default SampleData;

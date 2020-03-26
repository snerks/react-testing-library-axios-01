import React, { useState, useEffect } from "react";
import axios from "axios";

const useAxios = (url: string, setData: Function) => {
    useEffect(
        () => {
            let mounted = true;

            const loadData = async () => {
                const result = await axios.get(url);
                if (mounted) {
                    setData(result.data);
                }
            };
            loadData();

            return () => {
                mounted = false;
            };
        },
        [url]
    );
};

interface Props {
    url: string;
}

interface FetchGreetingResponse {
    greeting: string;
}

const FetchGreeting: React.FC<Props> = ({ url }) => {
    const [data, setData] = useState<FetchGreetingResponse | null>(null);
    useAxios(url, setData);

    if (data === null) {
        return <span data-testid="loading">Loading data...</span>;
    }

    return <span data-testid="resolved">{data.greeting}</span>;
}

export default FetchGreeting;
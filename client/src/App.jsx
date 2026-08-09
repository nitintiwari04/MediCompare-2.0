import { useEffect, useState } from "react";
import axios from "axios";

function App() {

    const [message, setMessage] = useState("Connecting...");

    useEffect(() => {

        axios
            .get("http://localhost:5000/api/health")
            .then((response) => {
                setMessage(response.data.message);
            })
            .catch((error) => {
                console.error(error);
                setMessage("Backend connection failed");
            });

    }, []);

    return (
        <div>
            <h1>MediCompare 2.0</h1>

            <p>{message}</p>
        </div>
    );
}

export default App;
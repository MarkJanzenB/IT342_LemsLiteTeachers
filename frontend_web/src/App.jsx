import React from "react";
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";
import { createBrowserHistory } from "history";
import Routes from "./components/Routes.jsx";
import "./App.css";
import { Helmet, HelmetProvider } from "react-helmet-async";

// Create browser history instance
const history = createBrowserHistory();

function App() {
    return (
        <HelmetProvider>
            <div className="MainBG">
                <HistoryRouter
                    history={history}
                    future={{
                        v7_startTransition: true,
                        v7_relativeSplatPath: true,
                    }}
                >
                    <Helmet>
                        <title>LEMS</title>
                    </Helmet>
                    <Routes />
                </HistoryRouter>
            </div>
        </HelmetProvider>
    );
}

export default App;
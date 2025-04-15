import { useState } from 'react'
import './App.css'
import AppRoutes from "./components/Routes.jsx";
import { BrowserRouter } from 'react-router-dom';

// const history = createBrowserHistory();

function App() {
    return (
        // <HelmetProvider>
            <div className="MainBG">
                {/*<HistoryRouter*/}
                {/*    history={history}*/}
                {/*    future={{*/}
                {/*        v7_startTransition: true,*/}
                {/*        v7_relativeSplatPath: true,*/}
                {/*    }}*/}
                {/*>*/}
                {/*    <Helmet>*/}
                {/*        <title>LEMS</title>*/}
                {/*    </Helmet>*/}
                <BrowserRouter>
                    <AppRoutes />
                    </BrowserRouter>
                {/*</HistoryRouter>*/}
            </div>
        // </HelmetProvider>
    );
}

export default App

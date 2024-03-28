import React from 'react';
import Panel from './views/panel/Panel';
import Home from './views/panel/Home';
import Members from './views/panel/members/Members';
import Competitions from './views/panel/competitions/Competitions';
import ConvocationSet from './views/panel/convocations/ConvocationSet';
import Convocations from './views/panel/convocations/Convocations';
import MemberSet from './views/panel/members/MemberSet';
import SignUp from './views/SignUp';
import SignIn from './views/SignIn.jsx';
import {Routes, Route, BrowserRouter} from 'react-router-dom';
import ConvocationView from "./views/panel/convocations/ConvocationView";
import ConvocationResponse from "./views/panel/convocations/ConvocationResponse";
import {DialogProvider} from "./views/context/DialogContext";
import {AppContextProvider} from "./views/context/AppContext";

const AppRouter = () => {
    return (
        <DialogProvider>
            <BrowserRouter>
                <AppContextProvider>
                    <Routes>
                        <Route path="/signin" element={<SignIn/>}/>
                        <Route path="/signup" element={<SignUp/>}/>
                        <Route path="/test" element={<ConvocationResponse/>}/>
                        <Route exact path="/" element={<Panel/>}>
                            <Route index element={<Home/>}/>
                            <Route path="/members" element={<Members/>}/>
                            <Route path="/members/new" element={<MemberSet/>}/>
                            <Route path="/members/edit/:id" element={<MemberSet/>}/>

                            <Route path="/competitions" element={<Competitions/>}/>

                            <Route path="/convocations" element={<Convocations/>}/>
                            <Route path="/convocations/new" element={<ConvocationSet/>}/>
                            <Route path="/convocations/edit/:id" element={<ConvocationSet/>}/>
                            <Route path="/convocations/:id" element={<ConvocationView/>}/>
                        </Route>
                    </Routes>
                </AppContextProvider>
            </BrowserRouter>
        </DialogProvider>
    )
}

export default AppRouter;

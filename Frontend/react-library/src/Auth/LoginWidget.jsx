import { useOktaAuth } from "@okta/okta-react";
import { SpinnerLoading } from "../layouts/Utils/SpinnerLoading";
import { Redirect } from "react-router-dom";
import OktaSigninWidget from "./OktaSigninWidget";

const LoginWidget = ({ config }) => {
    const {oktaAuth, authState} = useOktaAuth();
    const onSuccess = (tokens) => {
        oktaAuth.handleLoginRedirect(tokens);
    };
    const onError = (err) => {
        console.log("sign in error: ", err);
    };

    if (!authState) {
        return <SpinnerLoading />
    }

    return authState.isAuthenticated ? 
         <Redirect to={{ pathname: "/" }} />
     : 
        <OktaSigninWidget config={config} onError={onError} onSuccess={onSuccess}/>
};   


export default LoginWidget;

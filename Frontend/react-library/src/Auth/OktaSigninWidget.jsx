import OktaSignIn from "@okta/okta-signin-widget";
import { useEffect, useRef } from "react"
import { OktaConfig } from "../lib/OktaConfig";


const OktaSigninWidget = ({onSuccess, onError}) => {
    const widgetRef = useRef();

    useEffect (()=> {
        if(!widgetRef.current){
            return false;
        }
        
        const widget = new OktaSignIn(OktaConfig);

        widget.showSignInToGetTokens({
            el: widget.current,

        }).then(onSuccess).catch(onError);
        return () => widget.remove();
    }, [onSuccess, onError]);


    return (
        <div className="container mt-5 mb-5">
            <div ref={widgetRef}></div>
        </div>
    );
}


export default OktaSigninWidget;
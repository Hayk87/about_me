import { useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

type Props = {
    redirectTo: string;
    checkRedirect?: boolean
    withoutQueryParams?: boolean
};

export const AuthController = ({ redirectTo, checkRedirect, withoutQueryParams }: Props) => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (checkRedirect) {
            const redirectURL = location.search.replace('?r=', '');
            const hasRedirectURL = location.search.match(/^\?r=/);
            navigate(hasRedirectURL && redirectURL ? redirectURL : redirectTo);
        } else {
            navigate(redirectTo + (withoutQueryParams ? '' : `?r=${location.pathname + location.search}`));
        }
    }, []);
    
    return null;
}
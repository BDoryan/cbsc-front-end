import React, {createContext, useContext, useState, ReactNode, useEffect} from 'react';
import SignIn from "../SignIn.jsx";
import axios from 'axios';
import Notification from "../panel/notifications/Notification";
import Convocations from "../panel/convocations/Convocations";
import ConvocationResponse from "../panel/convocations/ConvocationResponse";
import convocations from "../panel/convocations/Convocations";

interface AppContextProps {
    logged: boolean,
    user: any,
    imManager: () => boolean,
    login: (email: string, password: string) => Promise<boolean>,
    loginWithToken: (token: string) => Promise<boolean>,
    logout: () => Promise<boolean>,
    getUserById: (id: number) => Promise<any | boolean>,
    addNotification: (title: string, message: string, type: string) => void,
    token_session: string,
    startLoading: () => void,
    stopLoading: () => void,
    API: string,
    toResource: (url: string) => string
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

const AppContextProvider: React.FC<{ children: ReactNode }> = ({children}) => {

    const API_SERVER = window.location.hostname.startsWith('cbsc-app') ? 'https://'+window.location.hostname+'/' : 'http://' + window.location.hostname + ':8000/';
    const API = API_SERVER + 'api/';

    const [user, setUser] = useState(null);
    const [tokenSession, setTokenSession] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [invitations, setInvitations] = useState([]);

    const toResource = (url: string | undefined): string => {
        if (!url) return null;
        if (url.charAt(0) === '/')
            url = url.substr(1);
        return API_SERVER + url;
    }

    useEffect(() => {
        if (user) {
            console.log(user);
            setInvitations(user.invitations);
        }
    }, [user]);

    const loadUser = () => {
        const token = localStorage.getItem('token');

        if (!token) {
            setIsLoading(false);
            setIsLoggedIn(false);
            return;
        }

        axios.get(API + 'user/me', {
            headers: {
                'Authorization': 'Bearer ' + token
            },
        }).then((response) => {
            if (response.status === 200) {
                setIsLoggedIn(true);
                setIsLoading(false);
                setTokenSession(token);
                setUser(response.data);
            }
        }).catch((e) => {
            setIsLoggedIn(false);
            setIsLoading(false);
            setTokenSession(null);
            setUser(null)

            localStorage.removeItem('token');
        });
    }

    useEffect(() => {
        loadUser();

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                loadUser();
            }
        };

        const handleWindowFocus = () => {
            if (document.visibilityState === 'visible') {
                // alert('test');
                loadUser();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('focus', handleWindowFocus);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('focus', handleWindowFocus);
        };
    }, []);

    const loginWithToken = async (token: string) => {
        try {
            const response = await axios.get(API + 'user/me', {
                headers: {
                    'Authorization': 'Bearer ' + token
                },
            });

            if (response.status === 200) {
                setIsLoggedIn(true);
                setIsLoading(false);
                setTokenSession(token);
                setUser(response.data);

                localStorage.setItem('token', token);
            }
        } catch (e) {
        }
        return false;
    }

    const getUserById = async (id: number) => {
        try {
            const response = await axios.get(API + 'users/' + id, {
                headers: {
                    'Authorization': 'Bearer ' + tokenSession
                },
            });

            if (response.status === 200)
                return response.data;
        } catch (e) {
            console.error(e)
        }
        return false;
    }

    const login = async (email: string, password: string) => {
        // post await /user/login with email and password with axios (wait response to return success or not)
        try {
            const response = await axios.post(API + 'user/login', {
                email: email,
                password: password
            });

            if (response.status === 200) {
                localStorage.setItem('token', response.data.token);
                setTokenSession(response.data.token);
                setUser(response.data.user)
                setIsLoggedIn(true)
                return true;
            }
            setIsLoggedIn(false)
            setTokenSession(null);
            setUser(null);
        } catch (error) {
        }
        return false;
    };

    const logout = async () => {
        // axios post request to logout /user/logout
        try {
            const response = await axios.post(API + 'user/logout', {}, {
                headers: {
                    "Authorization": 'Bearer ' + tokenSession
                }
            })

            if (response.status === 200) {
                setTokenSession(null)
                setIsLoggedIn(false)
                setUser(null)
                localStorage.removeItem('token');
            }
        } catch (e) {
        }
        return false;
    };

    // Notification (toasts) system
    const [notifications, setNotifications] = useState([]);

    // add notification (title, message, type) (temporary)
    const addNotification = (title: string, message: string, type: string) => {
        setNotifications((notifications) => [...notifications, {title, message, type}]);
    }

    // remove notification
    const removeNotification = (index: number) => {
        const newNotifications = [...notifications];
        newNotifications.splice(index, 1);
        setNotifications(newNotifications);
    }

    // useEffect(() => {
    //     addNotification('Bienvenue', 'Bienvenue sur notre application', 'success');
    //     addNotification('Erreur', 'Une erreur est survenue', 'error');
    //     addNotification('Attention', 'Attention, ceci est un message d\'attention', 'warning');
    // }, []);

    const imManager = () => {
        return user.managing != null;
    }

    return (
        <AppContext.Provider
            value={{
                imManager,
                logged: isLoggedIn,
                addNotification,
                startLoading: () => setIsLoading(true),
                stopLoading: () => setIsLoading(false),
                user,
                login,
                loginWithToken,
                getUserById,
                API,
                toResource,
                logout,
                token_session: tokenSession
            }}>
            <div
                className={"fixed z-50 w-[100vw] h-[100vh] bg-gray-200 flex items-center justify-center " + (isLoading ? 'block' : 'hidden')}>
                Chargement est en cours...
            </div>
            <div className="z-10 absolute p-5 right-0 bottom-0 flex items-end flex-col flex-grow-1 overflow-auto gap-4">
                {
                    notifications.map((notification, index) => (
                        <Notification hide={() => removeNotification(index)} title={notification.title}
                                      message={notification.message} type={notification.type}/>
                    ))
                }
            </div>
            <div className="flex flex-grow-1 flex-col overflow-auto">
                {(!isLoading && !isLoggedIn) &&
                    <>
                        <SignIn/>
                    </>
                }
                {(!isLoading && isLoggedIn && (invitations && invitations.length == 0)) && children}
                {/* afficher le première invitation */}
                {(!isLoading && isLoggedIn && (invitations && invitations.length > 0)) &&
                    <>
                        <ConvocationResponse onFinish={loadUser}
                                             id={invitations[0].id}
                                             members={invitations[0].convocation.invitations}
                                             title={invitations[0].convocation.title ?? 'Aucun titre défini'}
                                             content={invitations[0].convocation.content ?? 'Aucun contenu de défini'}
                                             datetime={new Date(invitations[0].convocation.datetime).toLocaleString() ?? 'Aucune date défini'}/>
                    </>
                }
            </div>
        </AppContext.Provider>
    );
};

const useAppContext = () => {
    const context = useContext(AppContext);

    if (!context) {
        throw new Error('useAppContext must be used within a AppContextProvider');
    }

    return context;
};

export {AppContextProvider, useAppContext};

import React, {useEffect, useState} from 'react';
// @ts-ignore
import {Link, RouteComponentProps} from 'react-router-dom';
import {useAppContext} from "../context/AppContext";

const Home: React.FC<RouteComponentProps<{}>> = () => {

    const {API, token_session, imManager,addNotification} = useAppContext();

    const [subscribed, setSubscribed] = useState(true);

    const urlBase64ToUint8Array = (base64String: string) => {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    async function subscribeUser() {
        if (!('serviceWorker' in navigator)) {
            console.log('Service workers are not supported');
            return;
        }
        const serviceWorker = await navigator.serviceWorker.ready;

        const subscription = await serviceWorker.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array('BJtf4rxFBC6Gqgp0JpbmykDG8tJtoQ0kUmjzvpGSGL6Pr_UyXjBeICyxbjestLnKuzqVOkblIN5s-tkvoR8J3JY')
        });
        console.log('Received PushSubscription: ', JSON.stringify(subscription));
        const r =  await sendSubscriptionToServer(subscription);

        if(r.ok) {
            setSubscribed(true);
            addNotification('Notifications activées', 'Vous recevrez désormais des notifications', 'success');
        }
        return r;
    }

    async function sendSubscriptionToServer(subscription) {
        return await fetch(API + 'subscribe', {
            method: 'POST',
            body: JSON.stringify(subscription),
            headers: {
                'Authorization': 'Bearer ' + token_session,
                'Content-Type': 'application/json'
            }
        });
    }

    const imSubscribed = async () => {
        if (!('serviceWorker' in navigator) || !('PushManager' in window))
            return;
        const serviceWorker = await navigator.serviceWorker.ready;
        const subscription = await serviceWorker.pushManager.getSubscription();
        return subscription !== null;
    }

    const unsubscribeUser = async () => {
        if (!('serviceWorker' in navigator) || !('PushManager' in window))
            return;
        const serviceWorker = await navigator.serviceWorker.ready;
        const subscription = await serviceWorker.pushManager.getSubscription();
        if (subscription) {
            setSubscribed(false)
            addNotification('Notifications désactivées', 'Vous ne recevrez plus de notifications', 'success');
            return await subscription.unsubscribe();
        }
    }

    useEffect(() => {
        async function initPushNotifications() {
            if ('serviceWorker' in navigator && 'PushManager' in window) {
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    verifySubscription();
                }
            }
        }

        const verifySubscription = async () => {
            if (!('serviceWorker' in navigator) || !('PushManager' in window))
                return;

            if (!await imSubscribed()) {
                subscribeUser();
                console.log('Subscribed to push notifications')
            } else {
                setSubscribed(true);
                console.log('Already subscribed to push notifications');
            }
        }

        initPushNotifications();
    }, []);

// useEffect(() => {
//     async function initPushNotifications() {
//         if ('serviceWorker' in navigator && 'PushManager' in window) {
//             const permission = await Notification.requestPermission();
//             if (permission === 'granted') {
//                 try {
//                     const response = await subscribeUser();
//
//                     if(response.ok) {
//                         console.log('Subscribed to push notifications');
//                     } else {
//                         console.log('Failed to subscribe to push notifications');
//                     }
//                 } catch (e) {
//                     console.error('Unable to subscribe to push', e);
//                 }
//             }
//         }
//     }
//
//     initPushNotifications();
// }, []);

    return (
        <div>
            <>
                <img className={"mx-auto mb-4 h-[150px]"} src="/logo192.png" alt=""/>
                <h2 className={"text-center text-xl font-semibold mb-8"}>Club Bouliste Saint Couatais</h2>
                <h2 className={"text-lg font-semibold"}>Gérer votre club de pétanque</h2>
                <p className={"text-gray-700"}>
                    Bienvenue sur l'application de gestion de club de pétanque.
                    Vous pouvez gérer vos membres et les convocations aux différents événements.
                </p>
                <div className={"mt-8 flex flex-col gap-2 text-center"}>
                    {imManager() ? (
                        <>
                            <Link to={"/members"}
                                  className={"bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"}>
                                <i className="me-2 fa-solid fa-users"></i>
                                Gérer les membres
                            </Link>
                            <Link to={"/members/new"}
                                  className={"bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"}>
                                <i className="me-2 fa-solid fa-user-plus"></i>
                                Ajouter un membre
                            </Link>
                            <div className="mt-5"></div>
                            <Link to={"/convocations/new"}
                                  className={"bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"}>
                                <i className="me-2 fa-solid fa-plus"></i>
                                Créer une convocation
                            </Link>
                            <Link to={"/convocations"}
                                  className={"bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"}>
                                <i className="me-2 fa-solid fa-calendar"></i>
                                Gérer les convocations
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to={"/members"}
                                  className={"bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"}>
                                <i className="me-2 fa-solid fa-users"></i>
                                Membres du club
                            </Link>
                            <Link to={"/convocations"}
                                  className={"bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"}>
                                <i className="me-2 fa-solid fa-calendar"></i>
                                Mes convocations
                            </Link>
                        </>
                    )}
                    <div className="pt-16 flex flex-col gap-2">
                        {subscribed ? (
                            <button onClick={unsubscribeUser}
                                    className={"bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"}>
                                <i className="me-2 fa-solid fa-bell-slash"></i>
                                Désactiver les notifications
                            </button>
                        ) : (
                            <button onClick={subscribeUser}
                                    className={"bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"}>
                                <i className="me-2 fa-solid fa-bell"></i>
                                Activer les notifications
                            </button>
                        )}
                    </div>
                </div>
            </>
        </div>
    );
}

export default Home;

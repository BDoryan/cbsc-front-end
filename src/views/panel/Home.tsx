import React, {useEffect, useState} from 'react';
// @ts-ignore
import {Link, RouteComponentProps} from 'react-router-dom';
import {useAppContext} from "../context/AppContext";

const Home: React.FC<RouteComponentProps<{}>> = () => {

    const { API, token_session } = useAppContext();

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
        const serviceWorker = await navigator.serviceWorker.ready;

        const subscription = await serviceWorker.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array( 'BJtf4rxFBC6Gqgp0JpbmykDG8tJtoQ0kUmjzvpGSGL6Pr_UyXjBeICyxbjestLnKuzqVOkblIN5s-tkvoR8J3JY')
        });
        console.log('Received PushSubscription: ', JSON.stringify(subscription));
        return await sendSubscriptionToServer(subscription);
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
            {/*<h1>Ma Progressive Web App</h1>*/}
            {/*<button onClick={subscribeUser}>S'abonner</button>*/}
        </div>
    );
}

export default Home;

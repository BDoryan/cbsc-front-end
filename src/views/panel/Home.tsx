import React, {useEffect, useState} from 'react';
// @ts-ignore
import { Link, RouteComponentProps } from 'react-router-dom';

const Home: React.FC<RouteComponentProps<{}>> = () => {

    useEffect(() => {
        // Demander la permission pour les notifications lors du chargement de la page
        Notification.requestPermission();
    }, []);

    const handleSendNotification = () => {
        // // Vérifier si les notifications sont autorisées
        if (Notification.permission === 'granted') {
            // Envoyer une notification
            new Notification('Nouvelle notification', {
                body: 'Ceci est le contenu de la notification.',
            });
        } else if (Notification.permission === 'denied') {
            alert('Les notifications sont désactivées. Veuillez autoriser les notifications dans les paramètres de votre navigateur.');
        } else {
            alert('Les notifications sont bloquées. Veuillez autoriser les notifications dans les paramètres de votre navigateur.');
        }
    };

    return (
        <div>
            <h1>Ma Progressive Web App</h1>
            <button onClick={handleSendNotification}>Envoyer une notification</button>
        </div>
    );
}

export default Home;

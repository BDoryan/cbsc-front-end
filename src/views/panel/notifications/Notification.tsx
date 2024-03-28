import React, {useEffect, useState} from 'react';

interface NotificationProps {
    hide: () => void,
    duration?: number,
    title: string;
    message: string;
    type: string;
}

const Notification: React.FC<NotificationProps> = ({ duration, hide, title, message, type }) => {

    const [showNotification, setShowNotification] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowNotification(false);
            setTimeout(() => {
                hide();
            }, 500);
        }, duration ?? 5000);

        return () => clearTimeout(timer);
    }, [duration]);


    let bgColorClass = '';
    let textColorClass = '';
    let icon = '';

    switch (type) {
        case 'success':
            bgColorClass = 'bg-green-50';
            textColorClass = 'text-green-700';
            icon = 'fa-check-circle';
            break;
        case 'error':
            bgColorClass = 'bg-red-50';
            textColorClass = 'text-red-700';
            icon = 'fa-exclamation-circle';
            break;
        case 'warning':
            bgColorClass = 'bg-yellow-50';
            textColorClass = 'text-yellow-700';
            icon = 'fa-exclamation-triangle';
            break;
        default:
            bgColorClass = 'bg-gray-50';
            textColorClass = 'text-gray-700';
            icon = 'fa-info-circle';
    }

    return (
        <div className={"w-full transform transition duration-500 ease-in-out "+(showNotification ? 'opacity-100' : 'opacity-0')}>
            <div className={`p-3 shadow-lg rounded-lg ${bgColorClass}`}>
                <div className="flex flex-row items-center justify-between">
                    <span className={`text-sm font-bold ${textColorClass}`}>
                        <i className={`fa-solid ${icon} me-1`}/>
                        {title}
                    </span>
                    <button onClick={() => hide()} className="text-gray-700 hover:text-gray-500">
                        <i className="fa-solid fa-close"/>
                    </button>
                </div>
                <p className="text-sm">{message}</p>
            </div>
        </div>
    );
};

export default Notification;

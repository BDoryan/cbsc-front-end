import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DialogContextProps {
    isDialogOpen: boolean;
    setDialog: (dialog: ReactNode) => void;
    closeDialog: () => void;
}

const DialogContext = createContext<DialogContextProps | undefined>(undefined);

const DialogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [dialog, setOpenDialog] = useState(null);

    const setDialog = (dialog: ReactNode) => {
        setOpenDialog(dialog);
    };

    const closeDialog = () => {
        setOpenDialog(null);
    };

    const isDialogOpen = dialog !== null;

    return (
        <DialogContext.Provider value={{ isDialogOpen, setDialog, closeDialog }}>
            {dialog}
            {children}
        </DialogContext.Provider>
    );
};

const useDialog = () => {
    const context = useContext(DialogContext);

    if (!context) {
        throw new Error('useDialog must be used within a DialogProvider');
    }

    return context;
};

export { DialogProvider, useDialog };
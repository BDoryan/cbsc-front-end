import React from 'react';
import { useDialog } from "../../context/DialogContext";

const ConfirmDialog = ({ title, content, confirm, cancel }) => {
    const { closeDialog } = useDialog();

    const getButtonStyle = (color) => {
        switch (color) {
            case 'red':
                return "bg-red-700 rounded-lg px-4 py-2 text-white hover:bg-red-800 hover:text-white";
            case 'green':
                return "bg-green-700 rounded-lg px-4 py-2 text-white hover:bg-green-800 hover:text-white";
            case 'indigo':
                return "bg-indigo-700 rounded-lg px-4 py-2 text-white hover:bg-indigo-800 hover:text-white";
            case 'gray':
                return "bg-gray-700 rounded-lg px-4 py-2 text-white hover:bg-gray-800 hover:text-white";
            default:
                return "bg-white rounded-lg px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-gray-900 border-[1px] border-gray-300";
        }
    };

    const confirmStyle = getButtonStyle(confirm?.color);
    const confirm_onclick = () => {
        closeDialog();
        confirm?.onclick();
    };

    const cancelStyle = getButtonStyle(cancel?.color);
    const cancel_onclick = () => {
        closeDialog();
        cancel?.onclick();
    };

    return (
        <>
            <div className="relative z-50 opacity-100" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

                <div className="opacity-100 translate-y-0 sm:scale-100 fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <div
                            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                        <h3 className="text-base font-semibold leading-6 text-gray-900"
                                            id="modal-title">
                                            {title ?? 'Untitled'}
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                {content ?? 'No content provided.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button onClick={confirm_onclick} type="button"
                                        className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold ${confirmStyle} shadow-sm sm:ml-3 sm:w-auto`}>
                                    {confirm?.text ?? 'No text'}
                                </button>
                                <button onClick={cancel_onclick} type="button"
                                        className={`mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold ${cancelStyle} shadow-sm hover:bg-gray-50 sm:mt-0 sm:w-auto`}>
                                    {cancel?.text ?? 'No text'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ConfirmDialog;

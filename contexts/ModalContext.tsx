'use client';
import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { ModalContext, type ModalOptions } from './ModalContextValue';

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ModalOptions | null>(null);
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null);

  const showModal = (opts: ModalOptions) => {
    return new Promise<boolean>((resolve) => {
      setOptions(opts);
      setIsOpen(true);
      setResolver(() => resolve);
    });
  };

  const handleClose = (result: boolean) => {
    setIsOpen(false);
    if (resolver) resolver(result);
    setResolver(null);
    setOptions(null);
  };

  return (
    <ModalContext.Provider value={{ showModal }}>
      {children}
      {isOpen && options && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-background rounded-lg shadow-xl max-w-md w-full p-4">
            {options.title && <h3 className="text-lg font-semibold mb-2">{options.title}</h3>}
            <div className="mb-4 text-sm opacity-[0.6]">{options.message}</div>
            <div className="flex justify-end gap-3">
              {options.showCancel && (
                <button
                  className="px-3 py-2 rounded bg-gray-100 hover:bg-gray-200"
                  onClick={() => handleClose(false)}
                >
                  {options.cancelText || 'Cancel'}
                </button>
              )}
              <button
                className="px-3 py-2 rounded bg-primary text-white"
                onClick={() => handleClose(true)}
              >
                {options.acceptText || 'OK'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};

// useModal is provided from a small helper file `useModal.ts` to avoid fast-refresh issues

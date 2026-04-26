import { createContext, type ReactNode } from "react";

export interface ModalOptions {
  title?: string;
  message: string | ReactNode;
  showCancel?: boolean;
  acceptText?: string;
  cancelText?: string;
};

type ModalContextValue = {
  showModal: (options: ModalOptions) => Promise<boolean>;
};

export const ModalContext = createContext<ModalContextValue | undefined>(undefined);

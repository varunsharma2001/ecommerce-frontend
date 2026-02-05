import { toast } from 'react-toastify';

export const showSuccess = (msg: string, time = 3000) =>
  toast.success(msg, {
    autoClose: time,
  });

export const showError = (msg: string, time = 4000) =>
  toast.error(msg, {
    autoClose: time,
  });

export const showInfo = (msg: string, time = 2000) =>
  toast.info(msg, {
    autoClose: time,
  });

import { useToast } from 'vue-toastification';

export const useAppToast = () => {
  const toast = useToast();

  const showSuccessToast = (message: string) => {
    toast.success(message);
  };

  const showErrorToast = (message: string) => {
    toast.error(message);
  };

  return { showSuccessToast, showErrorToast };
};

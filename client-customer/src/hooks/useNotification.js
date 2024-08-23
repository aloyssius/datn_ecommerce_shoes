import { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';

const useNotification = () => useContext(NotificationContext);

export default useNotification;

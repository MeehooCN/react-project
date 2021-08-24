/**
 * @description: 监听网络状态
 * @author: cnn
 * @createTime: 2021/4/28 13:44
 **/
import { useEffect, useState } from 'react';

const useNetwork = () => {
  const [isOnline, setIsOnline] = useState<boolean>(window.navigator.onLine);
  useEffect(() => {
    sessionStorage.setItem('isOnline', JSON.stringify(window.navigator.onLine));
    window.addEventListener('offline', updateNetwork);
    window.addEventListener('online', updateNetwork);
    return () => {
      window.removeEventListener('offline', updateNetwork);
      window.removeEventListener('online', updateNetwork);
    };
  }, []);
  // 更新网络状态
  const updateNetwork = () => {
    sessionStorage.setItem('isOnline', JSON.stringify(window.navigator.onLine));
    setIsOnline(window.navigator.onLine);
  };
  return { isOnline };
};
export default useNetwork;

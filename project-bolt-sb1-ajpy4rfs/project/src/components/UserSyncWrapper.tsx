// UserSyncWrapper.tsx
import { useEffect } from 'react'; 
import { useAuthStore } from '../store/useAuthStore';
import { useUserStore } from '../store/useUserStore';


export default function UserSyncWrapper({ children }: { children: React.ReactNode }) {
  const authUser = useAuthStore((state) => state.user);
  const setUser = useUserStore.setState;

  useEffect(() => {
    if (authUser) {
      setUser({ user: authUser });
    }
  }, [authUser, setUser]);

  return <>{children}</>;
}
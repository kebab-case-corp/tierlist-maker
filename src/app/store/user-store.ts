import { User } from 'firebase/auth';
import { create } from 'zustand';

interface UserState {
	user: User | null;
	loading: boolean;
	error: Error | null;
}

interface UserActions {
	setUser: (user: User | null) => void;
	setLoading: (loading: boolean) => void;
	setError: (error: Error | null) => void;
}

const initialState: UserState = {
	user: null,
	loading: true,
	error: null,
};

export const useUserStore = create<UserState & UserActions>((set) => ({
	...initialState,
	setUser: (user) => set({ user }),
	setLoading: (loading) => set({ loading }),
	setError: (error) => set({ error }),
}));

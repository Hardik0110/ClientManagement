import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  type User,
  type UserCredential,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from './firebase';

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthService {
  signIn: (credentials: AuthCredentials) => Promise<UserCredential>;
  signUp: (credentials: AuthCredentials) => Promise<UserCredential>;
  signOut: () => Promise<void>;
  getCurrentUser: () => User | null;
  onAuthChange: (callback: (user: User | null) => void) => () => void;
}

export const authService: AuthService = {
  signIn: (credentials: AuthCredentials) => 
    signInWithEmailAndPassword(auth, credentials.email, credentials.password),
  
  signUp: (credentials: AuthCredentials) => 
    createUserWithEmailAndPassword(auth, credentials.email, credentials.password),
  
  signOut: () => signOut(auth),
  
  getCurrentUser: () => auth.currentUser,
  
  onAuthChange: (callback: (user: User | null) => void) => 
    onAuthStateChanged(auth, callback)
};
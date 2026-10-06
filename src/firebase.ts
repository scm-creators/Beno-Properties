/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  onSnapshot,
  query,
  where,
  getDocFromServer,
  Firestore,
} from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";
import {
  UserProfile,
  Property,
  Appointment,
  ClientInvitation,
  Lead,
  TenantApplication,
  UserRole,
} from "./types";

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

/* CRITICAL: The app will break without this line per skill instructions */
export const db: Firestore = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Initial connection test as instructed in SKILL.md
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.error("Please check your Firebase configuration.");
    }
    // We don't throw here so the app boot is not blocked if offline
    return false;
  }
}

// Google Sign-In
export async function signInWithGoogle(): Promise<UserProfile> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const fbUser = result.user;
    return await syncOrCreateUserProfile(fbUser);
  } catch (err: unknown) {
    console.error("Google sign-in failed:", err);
    throw err;
  }
}

// Sign Out
export async function signOutUser(): Promise<void> {
  await fbSignOut(auth);
}

// Determine default role for user
export function getRoleForEmail(email: string | null | undefined): UserRole {
  if (!email) return "client";
  const normalized = email.trim().toLowerCase();
  if (normalized === "strcoderecords@gmail.com" || normalized.includes("admin@benoproperties.co.za")) {
    return "admin";
  }
  if (normalized.endsWith("@benoproperties.co.za")) {
    return "agent";
  }
  return "client";
}

// Sync or fetch user profile from Firestore
export async function syncOrCreateUserProfile(
  fbUser: FirebaseUser,
  requestedRole?: UserRole
): Promise<UserProfile> {
  const userPath = `users/${fbUser.uid}`;
  try {
    const userDocRef = doc(db, "users", fbUser.uid);
    const snap = await getDoc(userDocRef);

    if (snap.exists()) {
      const data = snap.data() as UserProfile;
      return {
        ...data,
        id: fbUser.uid,
        email: fbUser.email || data.email,
        name: data.name || fbUser.displayName || "User",
      };
    } else {
      const defaultRole = getRoleForEmail(fbUser.email);
      const role: UserRole = requestedRole && defaultRole !== "admin" ? requestedRole : defaultRole;
      const newUser: UserProfile = {
        id: fbUser.uid,
        name: fbUser.displayName || (fbUser.email ? fbUser.email.split("@")[0] : "Beno User"),
        email: fbUser.email || "",
        phone: fbUser.phoneNumber || undefined,
        role,
        favorites: [],
        imageUrl: fbUser.photoURL || undefined,
        createdAt: new Date().toISOString(),
        ...(role === "agent"
          ? {
              title: "Property Consultant",
              bio: "Beno Properties Associate Agent dedicated to Gauteng real estate.",
              specialization: ["Residential Sales", "Investment Advisory"],
            }
          : {}),
      };

      await setDoc(userDocRef, newUser);
      return newUser;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, userPath);
  }
}

// Save or Update User Profile
export async function updateUserProfileInFirestore(user: UserProfile): Promise<void> {
  const path = `users/${user.id}`;
  try {
    const userDocRef = doc(db, "users", user.id);
    await setDoc(userDocRef, user, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// Save Appointment to Firestore
export async function saveAppointmentToFirestore(appointment: Appointment): Promise<void> {
  const path = `appointments/${appointment.id}`;
  try {
    const aptRef = doc(db, "appointments", appointment.id);
    await setDoc(aptRef, appointment, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// Save Client Invitation to Firestore
export async function saveClientInvitationToFirestore(invitation: ClientInvitation): Promise<void> {
  const path = `clientInvitations/${invitation.id}`;
  try {
    const invRef = doc(db, "clientInvitations", invitation.id);
    await setDoc(invRef, invitation, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// Save Lead/Inquiry to Firestore
export async function saveLeadToFirestore(lead: Lead): Promise<void> {
  const path = `leads/${lead.id}`;
  try {
    const leadRef = doc(db, "leads", lead.id);
    await setDoc(leadRef, lead, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// Save Property Listing to Firestore
export async function savePropertyToFirestore(property: Property): Promise<void> {
  const path = `properties/${property.id}`;
  try {
    const propRef = doc(db, "properties", property.id);
    await setDoc(propRef, property, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// Save Tenant Application to Firestore
export async function saveTenantApplicationToFirestore(appData: TenantApplication): Promise<void> {
  const path = `tenantApplications/${appData.id}`;
  try {
    const appRef = doc(db, "tenantApplications", appData.id);
    await setDoc(appRef, appData, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// Realtime Subscriptions
export function subscribeToAppointments(
  userId: string | undefined,
  role: UserRole | undefined,
  onUpdate: (appointments: Appointment[]) => void
) {
  const path = "appointments";
  try {
    // If not logged in, return empty unsubscriber
    if (!auth.currentUser) {
      return () => {};
    }

    const colRef = collection(db, "appointments");
    // Depending on user role, listen to appropriate documents
    let q;
    if (role === "admin" || auth.currentUser.email === "strcoderecords@gmail.com") {
      q = query(colRef);
    } else if (role === "agent") {
      q = query(colRef, where("agentId", "==", auth.currentUser.uid));
    } else {
      q = query(colRef, where("clientId", "==", auth.currentUser.uid));
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: Appointment[] = [];
        snapshot.forEach((d) => list.push(d.data() as Appointment));
        onUpdate(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
    return unsubscribe;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export function subscribeToClientInvitations(
  onUpdate: (invitations: ClientInvitation[]) => void
) {
  const path = "clientInvitations";
  try {
    if (!auth.currentUser) return () => {};

    const colRef = collection(db, "clientInvitations");
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const list: ClientInvitation[] = [];
        snapshot.forEach((d) => list.push(d.data() as ClientInvitation));
        onUpdate(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
    return unsubscribe;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

export function subscribeToLeads(
  onUpdate: (leads: Lead[]) => void
) {
  const path = "leads";
  try {
    if (!auth.currentUser) return () => {};

    const colRef = collection(db, "leads");
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const list: Lead[] = [];
        snapshot.forEach((d) => list.push(d.data() as Lead));
        onUpdate(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
    return unsubscribe;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

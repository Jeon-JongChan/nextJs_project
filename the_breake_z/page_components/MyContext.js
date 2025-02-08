import { createContext } from "react";

const LocalDataContext = createContext({});
const HostContext = createContext(process.env.NEXT_PUBLIC_HOST);
const AdminSyncContext = createContext({});
const AdminSyncDataContext = createContext({});

export { LocalDataContext, HostContext, AdminSyncContext, AdminSyncDataContext };

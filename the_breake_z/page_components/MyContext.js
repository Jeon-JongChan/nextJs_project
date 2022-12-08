import { createContext } from "react";

const LocalDataContext = createContext({});
const HostContext = createContext(process.env.NEXT_PUBLIC_HOST);

export { LocalDataContext, HostContext };

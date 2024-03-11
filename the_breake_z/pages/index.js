//import Head from 'next/head'
//import Image from 'next/image'

import Battle from "/page_components/battle/Battle";
import {LocalDataContext, HostContext, AdminSyncContext, AdminSyncDataContext} from "/page_components/MyContext";
import {useRef, useState} from "react";

export default function Home() {
  const localData = useRef();
  localData.current = {};
  return (
    <LocalDataContext.Provider value={localData.current}>
      <Battle></Battle>
    </LocalDataContext.Provider>
  );
}

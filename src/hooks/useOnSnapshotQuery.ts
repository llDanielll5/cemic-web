/* eslint-disable react-hooks/exhaustive-deps */
import { collection, onSnapshot } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { db } from "../services/firebase";

export const useOnSnapshotQuery = (
  docRefStr: string,
  q?: any,
  deps?: any[]
) => {
  const [database, setDatabase] = useState<any[]>([]);
  const ref = collection(db, docRefStr);
  const snapshotQuery = useCallback(() => {
    onSnapshot(q ?? ref, (querySnapshot: any) => {
      const database: any[] = [];
      querySnapshot.forEach((doc: any) => {
        database.push(doc.data());
      });
      setDatabase(database);
    });
  }, deps ?? [q]);

  useEffect(() => {
    snapshotQuery();
  }, [snapshotQuery]);

  return database;
};

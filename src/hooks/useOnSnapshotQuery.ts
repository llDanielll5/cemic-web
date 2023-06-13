/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";

export const useOnSnapshotQuery = (
  docRefStr: string,
  query?: any,
  deps?: any[]
) => {
  const [database, setDatabase] = useState<any[]>([]);
  const ref = collection(db, docRefStr);
  const snapshotQuery = useCallback(() => {
    onSnapshot(query ?? ref, (querySnapshot: any) => {
      const database: any[] = [];
      querySnapshot.forEach((doc: any) => {
        database.push(doc.data());
      });
      setDatabase(database);
    });
  }, deps ?? [query]);

  useEffect(() => {
    snapshotQuery();
  }, [snapshotQuery]);

  return database;
};

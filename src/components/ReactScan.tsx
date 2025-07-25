"use client";
// react-scan must be imported before react
import { scan } from "react-scan";
import { JSX, useEffect } from "react";

export function ReactScan(): JSX.Element {
  useEffect(() => {
    scan({
      enabled: false,
      _debug: "verbose",
    });
  }, []);

  return <></>;
}

import { useState, useEffect } from "react";
import { parseShareUrl } from "../utils/share-utils";
import type { ParsedShare } from "../utils/share-utils";

interface ShareState extends ParsedShare {
  hasShare: true;
}

interface NoShareState {
  hasShare: false;
}

export function useShareState(): ShareState | NoShareState {
  const [parsed] = useState<ParsedShare | null>(() => parseShareUrl(window.location.search));

  // Strip query string after reading so bookmarks stay clean
  useEffect(() => {
    if (parsed) {
      history.replaceState(null, "", window.location.pathname);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (parsed) return { hasShare: true, ...parsed };
  return { hasShare: false };
}

import { useEffect, useRef, useState } from "react";

export default function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);

    return () => {
      setHasMounted(false);
    };
  }, []);

  return hasMounted;
}

import { useEffect, useRef } from "react";

export default function useClickOutsideOfElement<TElement>(
  onClickOutside: () => void,
  dependencies: any[] = []
) {
  const ref = useRef<TElement>(null);

  function handleClickOutside(event: MouseEvent) {
    if (ref.current && !(ref.current as any)?.contains(event.target as Node)) {
      onClickOutside();
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return ref;
}

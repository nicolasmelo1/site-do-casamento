import { PropsWithChildren } from "react";
import { useClickOutsideOfElement } from "../../hooks";

export default function Modal(
  props: PropsWithChildren<{
    className: string;
    onClose: () => void;
  }>
) {
  const clickOutsideRef = useClickOutsideOfElement<HTMLDivElement>(() => {
    props.onClose();
  });

  return (
    <div className="flex justify-center items-center absolute top-0 right-0 left-0 bottom-0 bg-black bg-opacity-40 z-10 overflow-hidden">
      <div ref={clickOutsideRef} className={props.className}>
        {props.children}
      </div>
    </div>
  );
}

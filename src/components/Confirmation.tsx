import { Modal } from "./Utils";

export default function Confirmation(props: { onClose: () => void }) {
  return (
    <Modal
      className="flex flex-col justify-between w-6/12 min-w-96 max-w-2xl min-h-96 h-screen md:max-h-[60vh] max-h-[50vh] bg-white p-6 rounded-2xl"
      onClose={props.onClose}
    >
      <div className=""></div>
    </Modal>
  );
}

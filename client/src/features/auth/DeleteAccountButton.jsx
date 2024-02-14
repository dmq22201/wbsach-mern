import { HiOutlineCheckCircle } from "react-icons/hi2";

import Modal from "../../components/Modal";
import Button from "../../components/Button";
import DeleteAccountForm from "./DeleteAccountForm";

function DeleteAccountButton() {
  return (
    <Modal>
      <Modal.Open id="deleteAccount">
        <Button type="danger" size="md" component="button">
          Xóa tài khoản
        </Button>
      </Modal.Open>
      <Modal.Window id="deleteAccount" isCloseWhenClickOuside={false}>
        <DeleteAccountForm />
      </Modal.Window>
    </Modal>
  );
}

export default DeleteAccountButton;

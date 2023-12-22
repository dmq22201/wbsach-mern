import { HiOutlinePlusCircle } from "react-icons/hi2";

import Button from "../../components/Button";
import Modal from "../../components/Modal";
import ShippingAddressAddForm from "./ShippingAddressAddForm";

function ShippingAddressButton() {
  return (
    <Modal>
      <Modal.Open id="addShippingAddress">
        <Button component="button" type="primary">
          <HiOutlinePlusCircle className="h-5 w-5 md:h-6 md:w-6" />
          Thêm một địa chỉ mới
        </Button>
      </Modal.Open>
      <Modal.Window id="addShippingAddress" isCloseWhenClickOuside={false}>
        <ShippingAddressAddForm />
      </Modal.Window>
    </Modal>
  );
}

export default ShippingAddressButton;

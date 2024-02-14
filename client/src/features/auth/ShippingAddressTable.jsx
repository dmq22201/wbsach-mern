import { HiOutlinePencilSquare, HiOutlineTrash } from "react-icons/hi2";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "./authSlice";

import Table from "../../components/Table";
import Menu from "../../components/Menu";
import Modal from "../../components/Modal";
import ShippingAddressDeleteForm from "./ShippingAddressDeleteForm";
import ShippingAddressEditForm from "./ShippingAddressEditForm";

function ShippingAddressTable() {
  const currentUser = useSelector(selectCurrentUser);

  return (
    <Table isActions={true}>
      <Table.Header>
        <Table.HeaderName>Địa chỉ giao hàng</Table.HeaderName>
        <Table.HeaderName>Số điện thoại</Table.HeaderName>
      </Table.Header>
      <Table.Body>
        {currentUser.shippingAddress.map((rowData) => (
          <Table.BodyRow
            rowData={{
              address: rowData.address,
              phoneNumber: rowData.phoneNumber,
            }}
            key={rowData._id}
          >
            <Menu>
              <Menu.Toggle id={rowData._id}>
                <HiOutlinePencilSquare className="h-4 w-4 transition-all hover:text-violet-600 md:h-6 md:w-6" />
              </Menu.Toggle>
              <Modal>
                <Menu.List id={rowData._id} size="w-20">
                  <Menu.Item>
                    <Modal.Open id="updateOneShippingAddress">
                      <button className="flex w-fit items-center gap-2 rounded-t-lg p-4 first-letter:font-semibold hover:bg-slate-100 dark:hover:bg-slate-600">
                        <HiOutlinePencilSquare className="h-4 w-4" />
                        <span>Sửa</span>
                      </button>
                    </Modal.Open>
                  </Menu.Item>
                  <Menu.Item>
                    <Modal.Open id="deleteOneShippingAddress">
                      <button className="flex w-fit items-center gap-2 rounded-b-lg p-4 first-letter:font-semibold hover:bg-slate-100 dark:hover:bg-slate-600 ">
                        <HiOutlineTrash className="h-4 w-4" />
                        <span>Xóa</span>
                      </button>
                    </Modal.Open>
                  </Menu.Item>
                </Menu.List>
                <Modal.Window
                  id="updateOneShippingAddress"
                  isCloseWhenClickOuside={false}
                >
                  <ShippingAddressEditForm rowData={rowData} />
                </Modal.Window>
                <Modal.Window
                  id="deleteOneShippingAddress"
                  isCloseWhenClickOuside={false}
                >
                  <ShippingAddressDeleteForm rowData={rowData} />
                </Modal.Window>
              </Modal>
            </Menu>
          </Table.BodyRow>
        ))}
      </Table.Body>
    </Table>
  );
}

export default ShippingAddressTable;

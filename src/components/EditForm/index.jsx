import { useState, useEffect } from "react";
import { updateOrder } from "../../services/ProductService";
import { MdEdit } from "react-icons/md";

export default function EditForm({
  orderId,
  status,
  orderNumber,
  orderDetail,
  onOrderUpdated,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [forms, setForms] = useState([]);
  const [initialForms, setInitialForms] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(status);
  const [formsToDelete, setFormsToDelete] = useState([]);

  useEffect(() => {
    setForms(orderDetail);
    setInitialForms(orderDetail);
  }, [orderDetail]);

  useEffect(() => {
    if (isOpen) {
      setSelectedStatus(status);
    }
  }, [isOpen, status]);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setForms(initialForms);
    setFormsToDelete([]);
  };

  const handleQuantityChange = (index, e) => {
    const newForms = [...forms];
    const { value } = e.target;

    if (!isNaN(value) && value > 0) {
      newForms[index].quantity = parseInt(value);
    } else {
      newForms[index].quantity = "";
    }

    if (index === forms.length - 1 && value !== "") {
      newForms.push({ name: "", unitPrice: 0, quantity: 0 });
    }

    setForms(newForms);
  };

  const handleDeleteForm = (index) => {
    const formToDelete = forms[index];
    setFormsToDelete([...formsToDelete, formToDelete]);
    const newForms = forms.filter((_, i) => i !== index);
    setForms(newForms);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedForms = forms.filter((form) => !formsToDelete.includes(form));

    const updatedOrder = {
      status: selectedStatus,
      orderDetail: updatedForms.map(
        ({ orderDetailId, name, unitPrice, quantity }) =>
          orderDetailId
            ? { orderDetailId, name, unitPrice, quantity }
            : { name, unitPrice, quantity }
      ),
    };

    console.log("With data:", updatedOrder);

    try {
      await updateOrder(orderId, updatedOrder);
      onOrderUpdated();
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  return (
    <>
      <button
        onClick={openModal}
        className="text-yellow-500 hover:text-yellow-600"
      >
        <MdEdit />
      </button>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
          <div className="text-white bg-slate-600 p-5 rounded flex flex-col justify-center items-center gap-5">
            <div>
              <p>{orderNumber}</p>
            </div>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col justify-center items-center"
            >
              <div>
                <div className="flex flex-col justify-center">
                  <div className="flex gap-8 pl-4 ml-2 w-fit mb-4">
                    <label>Status:</label>
                    <select
                      value={selectedStatus}
                      onChange={handleStatusChange}
                      className="text-black w-40 outline-none text-center"
                    >
                      <option value="p">Pending</option>
                      <option value="i">In Progress</option>
                      <option value="c">Completed</option>
                    </select>
                  </div>
                  <div className="flex flex-wrap justify-center max-xsm:text-xs">
                    {forms.map((form, index) => (
                      <div
                        key={index}
                        className="relative m-2 p-4 py-10 px-4 max-sm:pb-0"
                      >
                        <div className="flex gap-4 justify-between mt-3">
                          <label>Product:</label>
                          <input
                            type="text"
                            readOnly
                            value={form.name}
                            disabled
                            className="text-black w-40 bg-white text-center"
                          />
                        </div>
                        <div className="flex gap-4 justify-between mt-3">
                          <label>Price:</label>
                          <input
                            type="text"
                            readOnly
                            disabled
                            value={form.unitPrice}
                            className="text-black w-40 bg-white text-center"
                          />
                        </div>
                        <div className="flex gap-4 justify-between mt-3">
                          <label>Quantity:</label>
                          <input
                            type="number"
                            value={form.quantity}
                            onChange={(e) => handleQuantityChange(index, e)}
                            className="text-black w-40 outline-none text-center"
                          />
                        </div>
                        <button
                          className="absolute top-0 right-0 mt-3 mr-3 py-1 px-4 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs"
                          onClick={() => handleDeleteForm(index)}
                          type="button"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 max-sm:pt-4">
                <button
                  type="submit"
                  className="bg-green-500 text-black rounded-full py-1 px-4 hover:bg-green-600 hover:text-white text-lg max-sm:text-sm max-xsm:text-xs"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-blue-500 text-black rounded-full py-1 px-4 hover:bg-blue-600 hover:text-white text-lg max-sm:text-sm max-xsm:text-xs"
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

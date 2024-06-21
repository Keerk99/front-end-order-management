import { useEffect, useState } from "react";
import { listOrders, deleteOrder } from "../services/ProductService";
import Modal from "../components/Modal";
import EditForm from "../components/EditForm";
import { MdDelete } from "react-icons/md";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [orderIdToDelete, setOrderIdToDelete] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  useEffect(() => {
    listOrders()
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleConversionStatus = (status) => {
    let s;
    switch (status) {
      case "p":
        s = "Pending";
        break;
      case "i":
        s = "In Progress";
        break;
      case "c":
        s = "Completed";
        break;
      default:
        s = "Wrong Status";
        break;
    }

    return s;
  };

  const handleStatusColor = (status) => {
    let color;
    switch (status) {
      case "p":
        color = "bg-blue-600";
        break;
      case "i":
        color = "bg-yellow-600";
        break;
      case "c":
        color = "bg-green-600";
        break;
      default:
        color = "bg-black-600";
        break;
    }
    return color;
  };

  const updateOrdersList = async () => {
    try {
      const response = await listOrders();
      setOrders(response.data);
    } catch (error) {
      console.error("Error updating orders list:", error);
    }
  };

  const confirmDeleteOrder = (orderId) => {
    setOrderIdToDelete(orderId);
    setShowConfirmationModal(true);
  };

  const handleDeleteOrder = async () => {
    try {
      await deleteOrder(orderIdToDelete);
      setOrderIdToDelete(null);
      setShowConfirmationModal(false);
      updateOrdersList();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const cancelDeleteOrder = () => {
    setOrderIdToDelete(null);
    setShowConfirmationModal(false);
  };

  return (
    <main className="flex-grow bg-main-page bg-no-repeat bg-cover bg-center">
      <section className="max-w-screen-3xl flex justify-center items-center my-0 mx-auto py-12 px-40 max-xsm:px-1">
        <div className="flex max-w-screen-xl">
          <table>
            <thead>
              <tr className="bg-slate-500 text-white max-lg:text-sm max-xsm:text-[0.6rem] max-2xsm:text-[0.5rem]">
                <th className="px-2 py-3 max-2xsm:px-1 max-2xsm:py-0">
                  Order Number
                </th>
                <th className="px-2 py-3 max-2xsm:px-1 max-2xsm:py-0">Date</th>
                <th className="px-2 py-3 max-2xsm:px-1 max-2xsm:py-0">Total</th>
                <th className="px-2 py-3 max-2xsm:px-1 max-2xsm:py-0">
                  Status
                </th>
                <th className="px-2 py-3 max-2xsm:px-1 max-2xsm:py-0">
                  Detail
                </th>
                <th className="px-2 py-3 max-2xsm:px-1 max-2xsm:py-0">
                  Options
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map(
                ({
                  orderId,
                  orderNumber,
                  date,
                  total,
                  status,
                  orderDetail,
                }) => (
                  <tr
                    key={orderId}
                    className="bg-slate-200 max-lg:text-sm max-md:text-[0.70rem] max-xsm:text-[0.6rem] max-2xsm:text-[0.5rem]"
                  >
                    <td className="px-2 py-1 max-2xsm:px-1 max-2xsm:py-0">
                      {orderNumber}
                    </td>
                    <td className="px-2 py-1 text-center max-2xsm:px-1 max-2xsm:py-0">
                      {date}
                    </td>
                    <td className="px-2 py-1 text-right max-2xsm:px-1 max-2xsm:py-0">
                      {total.toFixed(2)} $
                    </td>
                    <td
                      className={`px-2 py-1 text-center ${handleStatusColor(
                        status
                      )} max-2xsm:px-1 max-2xsm:py-0`}
                    >
                      {handleConversionStatus(status)}
                    </td>
                    <td className="px-2 py-1 text-center">
                      <Modal
                        orderNumber={orderNumber}
                        orderDetail={orderDetail}
                      />
                    </td>
                    <td className="px-2 py-1">
                      {status !== "c" && (
                        <div className="flex justify-around">
                          <EditForm
                            orderId={orderId}
                            status={status}
                            orderNumber={orderNumber}
                            orderDetail={orderDetail}
                            onOrderUpdated={updateOrdersList}
                          />
                          <button
                            onClick={() => confirmDeleteOrder(orderId)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <MdDelete />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </section>

      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
          <div className="text-white bg-slate-600 p-5 rounded flex flex-col justify-center items-center gap-5">
            <p>Are you sure you want to delete this order?</p>
            <div className="flex gap-4">
              <button
                onClick={handleDeleteOrder}
                className="bg-red-500 text-black rounded-full py-1 px-4 hover:bg-red-600 hover:text-white"
              >
                OK
              </button>
              <button
                onClick={cancelDeleteOrder}
                className="bg-blue-500 text-black rounded-full py-1 px-4 hover:bg-blue-600 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

import { useState } from "react";
import { MdRemoveRedEye } from "react-icons/md";

export default function Modal({ orderNumber, orderDetail }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        onClick={handleModal}
        className="text-blue-500 hover:text-blue-600"
      >
        <MdRemoveRedEye />
      </button>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
          <div className="text-white bg-slate-600 p-5 rounded flex flex-col justify-center items-center gap-5">
            <div>
              <p>{orderNumber}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th className="px-4">Product</th>
                  <th className="px-4">Price</th>
                  <th className="px-4">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {orderDetail.map(
                  ({ name, orderDetailId, quantity, unitPrice }) => (
                    <tr key={orderDetailId}>
                      <td className="text-left px-4">{name}</td>
                      <td className="text-right px-4">{unitPrice} $</td>
                      <td className="px-4">{quantity}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
            <div>
              <button
                onClick={handleModal}
                className="bg-blue-500 text-black rounded-full py-1 px-4 hover:bg-blue-600 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

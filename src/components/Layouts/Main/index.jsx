import { useEffect, useState } from "react";
import {
  listProducts,
  createOrder,
  listOrders,
} from "../../../services/ProductService";

export default function Main() {
  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState([]);
  const [forms, setForms] = useState([]);
  const [lastOrderCode, setLastOrderCode] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    listProducts()
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    listOrders()
      .then((response) => {
        if (response.data.length === 0) {
          setLastOrderCode(0);
        } else {
          const maxOrderCode = Math.max(
            ...response.data.map((order) =>
              parseInt(order.orderNumber.split("-")[1])
            )
          );
          setLastOrderCode(maxOrderCode);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleButtonClick = () => {
    setShowForm(true);
    addForm();
  };

  const handleProductChange = (index, e) => {
    const productName = e.target.value;
    const product = products.find((p) => p.name === productName);
    const newForms = [...forms];
    newForms[index].selectedProduct = productName;
    newForms[index].selectedPrice = product ? product.unitPrice : "";
    setForms(newForms);
  };

  const handleQuantityChange = (index, e) => {
    const newForms = [...forms];
    const { value } = e.target;

    if (!isNaN(value) && value > 0) {
      newForms[index].quantity = value;
    } else {
      newForms[index].quantity = "";
    }
    setForms(newForms);
  };

  const addForm = () => {
    const newForm = {
      selectedProduct: "",
      selectedPrice: "",
      quantity: "",
    };
    setForms([...forms, newForm]);
  };

  const removeForm = (indexToRemove) => {
    const newForms = forms.filter((form, index) => index !== indexToRemove);
    setForms(newForms);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const hasSelectedProduct = forms.some(
      (form) => form.selectedProduct !== "" && form.quantity > 0
    );

    if (!hasSelectedProduct) {
      setShowModal(true);
      return;
    }

    const nextOrderCode = `ORD-${String(lastOrderCode + 1).padStart(5, "0")}`;

    const orderData = {
      orderNumber: nextOrderCode,
      orderDetail: forms
        .filter((form) => form.selectedProduct !== "" && form.quantity > 0)
        .map((form) => ({
          name: form.selectedProduct,
          unitPrice: form.selectedPrice,
          quantity: form.quantity,
        })),
    };

    createOrder(orderData)
      .then((response) => {
        console.log("Order created successfully", response.data);
        setShowForm(false);
        setForms([]);
        setLastOrderCode(lastOrderCode + 1);
      })
      .catch((error) => {
        console.error("There was an error creating the order!", error);
      });
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <main className="flex-grow bg-main-page bg-no-repeat bg-cover bg-center">
      <section className="max-w-screen-3xl flex justify-center items-center my-0 mx-auto py-12 px-40 max-xsm:px-1">
        <div className="flex max-w-screen-xl">
          {!showForm ? (
            <button
              onClick={handleButtonClick}
              className="bg-green-500 rounded py-2 px-3 hover:bg-green-600 hover:text-white text-xl max-xsm:text-xs"
            >
              New Order
            </button>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center gap-4"
            >
              <h3 className="text-white text-2xl max-xsm:text-xl">
                Product Code:{" "}
                {`ORD-${String(lastOrderCode + 1).padStart(5, "0")}`}
              </h3>
              <button
                type="button"
                onClick={addForm}
                className="bg-green-500 rounded-full py-1 px-4 hover:bg-green-600 hover:text-white text-lg max-xsm:text-xs"
              >
                Add
              </button>
              <div className="flex flex-wrap justify-center gap-6">
                {forms.map((form, index) => (
                  <div
                    key={index}
                    className="relative py-10 px-4 text-white bg-slate-600 rounded-lg max-xsm:text-xs"
                  >
                    <div className="flex gap-4 justify-between mt-3">
                      <label>Product:</label>
                      <select
                        name="product"
                        id={`product-${index}`}
                        onChange={(e) => handleProductChange(index, e)}
                        value={form.selectedProduct}
                        className="text-black w-40 outline-none text-center"
                      >
                        <option value="">Choose a Product</option>
                        {products.map((product) => (
                          <option key={product.productId} value={product.name}>
                            {product.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-4 justify-between mt-3">
                      <label>Price:</label>
                      <input
                        type="text"
                        name="price"
                        id={`price-${index}`}
                        value={form.selectedPrice}
                        readOnly
                        disabled
                        className="text-black w-40 bg-white text-center"
                      />
                    </div>
                    <div className="flex gap-4 justify-between mt-3">
                      <label>Quantity:</label>
                      <input
                        type="number"
                        name={`quantity-${index}`}
                        value={form.quantity}
                        onChange={(e) => handleQuantityChange(index, e)}
                        className="text-black w-40 outline-none text-center"
                      />
                    </div>
                    <button
                      type="button"
                      className="absolute top-0 right-0 mt-3 mr-3 py-1 px-4 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs max-xsm:text-[0.6rem]"
                      onClick={() => removeForm(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="submit"
                className="bg-blue-500 rounded-full py-1 px-4 hover:bg-blue-600 hover:text-white text-lg max-xsm:text-xs"
              >
                Buy
              </button>
            </form>
          )}
        </div>
      </section>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
          <div className="text-white bg-slate-600 p-5 rounded flex flex-col justify-center items-center gap-5">
            <p className="max-xsm:text-xs">
              You must order at least 1 product to Buy
            </p>
            <button
              onClick={closeModal}
              className="bg-blue-500 text-black rounded-full py-1 px-4 hover:bg-blue-600 hover:text-white max-xsm:text-xs"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

import React, { useEffect, useState } from "react";
import axiosInstance from "../../../axios/adminaxios";
import { BsPencil } from "react-icons/bs";

function PremiumPlans() {
  let [plans, SetPlans] = useState([]);
  let [modalVisible, setModalVisible] = useState(false);
  let [EditmodalVisible, setEditmodalVisible] = useState(false);

  let [id,SetId]=useState()
  let [heading, setheading] = useState("");
  let [Amount, setAmount] = useState();
  let [Discount, setDiscount] = useState();
  let [Duration, SetDuration] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      let res = await axiosInstance.get("/getPremium");
      SetPlans(res.data);
    };
    fetchData();
  }, []);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
  
  const EditPlantoggleModal = () => {
    setEditmodalVisible(!EditmodalVisible);
  };


  const AddPlanHandler = async (e) => {
    e.preventDefault();
    try {
      let res = await axiosInstance.put("/addPremiumPlan", {
        heading,
        Amount,
        Discount,
        Duration,
      });
      setModalVisible(!modalVisible);
      SetPlans([...plans, res.data]);
    } catch (error) {
      console.log(error.message);
    }
  };

  const EditPlanHandler = async (e) => {
    e.preventDefault();
    try {
      let res = await axiosInstance.patch("/editPremiumPlan", {
        id,
        heading,
        Amount,
        Discount,
        Duration,
      });
      setEditmodalVisible(!EditmodalVisible);
      SetPlans(res.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const EditPlan=async(e)=>{
  
    try {
        SetId(e._id)
        setheading(e.Heading)
        setAmount(e.Amount)
        setDiscount(e.Discount)
        SetDuration(e.duration)
        setEditmodalVisible(true)
        
    } catch (error) {
        console.log(error.message)
    }
  }

  const ActiveDeactivateManagement=async(e)=>{

    try {
        // console.log(e)
        let res=await axiosInstance.post('/activateDeactivatePlan',e)
        SetPlans(res.data)
    } catch (error) {
        console.log(error.message)
    }
  }



  return (
    <div className="pt-16 px-6">
      <div>
        <div className="w-full  min-h-screem rounded-md mb-12 shadow-xl flex-col ">
          <div className="p-6">
            <button
              className="bg-yellow-500 rounded-md p-2 m-4"
              onClick={toggleModal}
            >
              Add Plan
            </button>
            {modalVisible && (
              <div>
                <div
                  className="fixed top-0 left-0 right-0 bottom-0 bg-black opacity-70 z-40"
                  onClick={toggleModal}
                ></div>
                <div
                  id="defaultModal"
                  className="fixed flex items-center justify-center top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
                >
                  <div className="relative w-full max-w-2xl max-h-full">
                    <div className="relative bg-gray-200 rounded-lg shadow text-neutral-800 my-4 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-teal-500 dark:focus:ring-teal-300">
                      {" "}
                      <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 ">
                          Add a plan
                        </h3>
                        <button
                          type="button"
                          onClick={toggleModal}
                          className="text-gray-900 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                          data-modal-hide="defaultModal"
                        >
                          <svg
                            className="w-3 h-3"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 14"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                            />
                          </svg>
                          <span className="sr-only">Close modal</span>
                        </button>
                      </div>
                      <form onSubmit={AddPlanHandler}>
                        <div className="p-6 space-y-3 flex flex-col">
                          <label htmlFor="Heading">Heading</label>
                          <input
                            type="text"
                            className="rounded-lg"
                            // value={heading}
                            onChange={(e) => setheading(e.target.value)}
                          />
                          <label htmlFor="description">Amount</label>
                          <input
                            type="number"
                            className="rounded-lg"
                            // value={Amount}
                            onChange={(e) => setAmount(e.target.value)}
                          />
                          <label htmlFor="service">
                            Discount (In percentage)
                          </label>
                          <input
                            type="number"
                            className="rounded-lg"
                            // value={Discount}
                            onChange={(e) => setDiscount(e.target.value)}
                          />
                          <label htmlFor="service">Duration (In days)</label>
                          <input
                            type="number"
                            className="rounded-lg"
                            // value={Duration}
                            onChange={(e) => SetDuration(e.target.value)}
                          />
                        </div>
                        <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-100">
                          <button
                            data-modal-hide="defaultModal"
                            type="submit"
                            className="text-white font-semibold  bg-lime-600 hover:bg-mainColor-400 focus:ring-4 focus:outline-none focus:ring-mainColor-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-mainColor-600 dark:hover:bg-mainColor-700 dark:focus:ring-mainColor-800"
                          >
                            Post
                          </button>
                          <button
                            data-modal-hide="defaultModal"
                            type="button"
                            onClick={toggleModal}
                            className="text-gray-500 font-semibold bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}
             {EditmodalVisible && (
              <div>
                <div
                  className="fixed top-0 left-0 right-0 bottom-0 bg-black opacity-70 z-40"
                  onClick={EditPlantoggleModal}
                ></div>
                <div
                  id="defaultModal"
                  className="fixed flex items-center justify-center top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
                >
                  <div className="relative w-full max-w-2xl max-h-full">
                    <div className="relative bg-gray-200 rounded-lg shadow text-neutral-800 my-4 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-teal-500 dark:focus:ring-teal-300">
                      {" "}
                      <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 ">
                          Add a plan
                        </h3>
                        <button
                          type="button"
                          onClick={EditPlantoggleModal}
                          className="text-gray-900 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                          data-modal-hide="defaultModal"
                        >
                          <svg
                            className="w-3 h-3"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 14"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                            />
                          </svg>
                          <span className="sr-only">Close modal</span>
                        </button>
                      </div>
                      <form onSubmit={EditPlanHandler}>
                        <div className="p-6 space-y-3 flex flex-col">
                          <label htmlFor="Heading">Heading</label>
                          <input
                            type="text"
                            className="rounded-lg"
                            value={heading}
                            onChange={(e) => setheading(e.target.value)}
                          />
                          <label htmlFor="description">Amount</label>
                          <input
                            type="number"
                            className="rounded-lg"
                            value={Amount}
                            onChange={(e) => setAmount(e.target.value)}
                          />
                          <label htmlFor="service">
                            Discount (In percentage)
                          </label>
                          <input
                            type="number"
                            className="rounded-lg"
                            value={Discount}
                            onChange={(e) => setDiscount(e.target.value)}
                          />
                          <label htmlFor="service">Duration (In days)</label>
                          <input
                            type="number"
                            className="rounded-lg"
                            value={Duration}
                            onChange={(e) => SetDuration(e.target.value)}
                          />
                        </div>
                        <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-100">
                          <button
                            data-modal-hide="defaultModal"
                            type="submit"
                            className="text-white font-semibold  bg-lime-600 hover:bg-mainColor-400 focus:ring-4 focus:outline-none focus:ring-mainColor-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-mainColor-600 dark:hover:bg-mainColor-700 dark:focus:ring-mainColor-800"
                          >
                            Post
                          </button>
                          <button
                            data-modal-hide="defaultModal"
                            type="button"
                            onClick={EditPlantoggleModal}
                            className="text-gray-500 font-semibold bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {plans.length>0 ? (
              <table className="rounded-md mb-2 shadow-lg bg-gray-200 w-full">
                <thead>
                  <tr>
                    <th className="text-lg font-bold px-6 py-3 text-center">
                      Plan
                    </th>
                    <th className="text-lg font-bold px-6 py-3 text-center">
                      Amount
                    </th>
                    <th className="text-lg font-bold px-6 py-3 text-center">
                      Discount
                    </th>
                    <th className="text-lg font-bold px-6 py-3 text-center">
                      Current amount
                    </th>
                    <th className="text-lg font-bold px-6 py-3 text-center">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-center">Status</th>
                    <th className="px-6 py-3 text-center">Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map((plan) => (
                    <tr key={plan.id} className="shadow-lg">
                      <td className="px-6 py-4 text-center">{plan.Heading}</td>
                      <td className="px-6 py-4 text-center">{plan.Amount}<span className="ml-2 text-xs font-semibold">₹</span></td>
                      <td className="px-6 py-4 text-center">{plan.Discount}<span className="ml-2 text-xs font-semibold">(%)</span></td>
                      <td className="px-6 py-4 text-center">{plan.Amount*(100-plan.Discount)/100}<span className="ml-2 text-xs font-semibold">₹</span></td>
                      <td className="px-6 py-4 text-center">{plan.duration}<span className="ml-2 text-xs font-semibold">Days</span> </td>
                      <td className="px-6 py-4 text-center">
                       {plan.isActive==true?<button className="text-red-500" onClick={()=>ActiveDeactivateManagement(plan)}>Deactivate</button>:<button className="text-green-800" onClick={()=>ActiveDeactivateManagement(plan)}>Activate</button>} 
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button onClick={() => EditPlan(plan)}><BsPencil className="w-5 h-5 text-lime-600" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="font-bold">There are no Premium plans</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PremiumPlans;

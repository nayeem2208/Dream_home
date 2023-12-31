import React, { useEffect, useState } from "react";
import axiosInstance from "../../../axios/adminaxios";


function Sales() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let res = await axiosInstance.get("/getAllSales");
        setSales(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const totalSalesAmount = sales.reduce(
    (total, sale) => total + (sale.Amount || 0),
    0
  );

  return (
    <div className="pt-16 px-6 mt-6">
      <div>
        <p className="flex justify-center text-xl font-bold">Sales</p>
        <div className="flex justify-between">
          <p className="my-4">
            Total sales:
            <span className="font-bold mx-2">{totalSalesAmount}</span>₹
          </p>{" "}
          {/* <button
            id="dropdownHoverButton"
            data-dropdown-toggle="dropdownHover"
            data-dropdown-trigger="hover"
            type="button"
          >
            <AiOutlineMenu className="mx-8 mt-4 font-bold text-black w-4 h-4" />
          </button>
          <div
            id="dropdownHover"
            className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
          >
            <ul
              className="py-2 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdownHoverButton"
            >
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Settings
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Earnings
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Sign out
                </a>
              </li>
            </ul>
          </div> */}
        </div>
        <div className="w-full  min-h-screem rounded-md mb-12 shadow-xl flex-col ">
          <div className="p-6">
            {sales.length > 0 ? (
              <table className="rounded-md mb-2 shadow-lg bg-gray-200 w-full">
                <thead>
                  <tr>
                    <th className="text-lg font-bold px-6 py-3 text-center">
                      User
                    </th>
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
                      Date
                    </th>
                    <th className="text-lg font-bold px-6 py-3 text-center">
                      Final amount
                    </th>
                    {/* <th className="px-6 py-3 text-center">Status</th>
                    <th className="px-6 py-3 text-center">Edit</th> */}
                  </tr>
                </thead>
                <tbody>
                  {sales.map((sale, index) => (
                    <tr key={index} className="shadow-lg">
                      <td className="px-6 py-4 text-center flex font-bold">
                        <div className="w-6 h-6 rounded-full overflow-hidden mr-3">
                          <img
                            src={`https://www.dreamhome.cloud/images/${sale.UserDetails.profilePic}`}
                            alt=""
                            className="object-cover w-full h-full"
                          />
                        </div>
                        {sale.UserDetails.username}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {sale.Plan.Heading}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="ml-2 text-xs font-semibold">₹</span>
                        {sale.Plan.Amount}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {sale.Plan.Discount}
                        <span className="ml-2 text-xs font-semibold">(%)</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {new Date(sale.createdAT).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {sale.Amount
                          ? sale.Plan.Amount - (sale.Plan.Amount - sale.Amount)
                          : 0}
                        <span className="ml-2 text-xs font-semibold">₹</span>
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

export default Sales;

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

  const totalSalesAmount = sales.reduce((total, sale) => total + (sale.Amount || 0), 0);

  console.log(totalSalesAmount);
  return (
    <div className="pt-16 px-6 mt-6">
      <div>
        <p className="flex justify-center text-xl font-bold">Sales</p>
        <p className="my-4">Total sales:<span className="font-bold mx-2">{totalSalesAmount}</span>₹</p>
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
                      Expiry
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
                            src={`http://localhost:3000/images/${sale.UserDetails.profilePic}`}
                            alt=""
                            className="object-cover w-full h-full"
                          />
                        </div >
                        {sale.UserDetails.username}
                      </td>
                      <td className="px-6 py-4 text-center">{sale.Plan.Heading}</td>
                      <td className="px-6 py-4 text-center">
                        
                        <span className="ml-2 text-xs font-semibold">₹</span>{sale.Plan.Amount}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {sale.Plan.Discount}
                        <span className="ml-2 text-xs font-semibold">(%)</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                      {new Date(sale.Expiry).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {sale.Amount?sale.Plan.Amount -(sale.Plan.Amount-sale.Amount):0}
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

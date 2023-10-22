import React, { useEffect, useState } from "react";
import axiosInstance from "../../axios/axios";
import Logo from "../../assets/logowhite.png";
import "../../App.css";
import { toast } from "react-toastify";


function PremiumPage() {
  const [plans, SetPlans] = useState([]);
  const [paidPlan, SetPaidPlan] = useState([]);
  const [planPreview, SetPlanPreview] = useState(true);
  const [Planid, setPlanId] = useState("");
  const [duration, SetDuration] = useState(0);
  const [remainingTime, setRemainingTime] = useState("");
  const [refresh,SetRefresh]=useState(true)

  useEffect(() => {
    const fetchData = async () => {
      let res = await axiosInstance.get("/getPlans");
      SetPaidPlan(res.data.paidPlans);
      SetPlans(res.data.plans);
      if (res.data.paidPlans.length > 0) {
        const expiryDate = new Date(res.data.paidPlans[0].Expiry);
        const currentDate = new Date();
        const timeDifference = expiryDate - currentDate;

        const daysRemaining = Math.floor(
          timeDifference / (1000 * 60 * 60 * 24)
        );
        const hoursRemaining = Math.floor(
          (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutesRemaining = Math.floor(
          (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
        );

        setRemainingTime(
          `${daysRemaining} days, ${hoursRemaining} hours, ${minutesRemaining} minutes`
        );
      }
    };
    fetchData();
  }, [refresh]);

  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  async function displayRazorpay(e) {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    // creating a new order
    const result = await axiosInstance.post("http://localhost:3000/Razorpay", 
      e,
    );

    if (!result) {
      alert("Server error. Are you online?");
      return;
    }

    // Getting the order details back
    const { amount, id: order_id, currency } = result.data.order;
    const planId=result.data.planId
    const durationofPremium=result.data.duration

    const options = {
      key: "rzp_test_oi94ipZRJidf2Y", // Enter the Key ID generated from the Dashboard
      amount: amount.toString(),
      currency: currency,
      name: "Dream Home",
      description: "Test Transaction",
      image: { Logo },
      order_id: order_id,
      handler: async function (response) {
        const data = {
          orderCreationId: order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
          planId: planId,
          amount: amount.toString(),
          duration:durationofPremium,
          planId
        };

        const result = await axiosInstance.post(
          "http://localhost:3000/paymentSuccess",
          data
        );

        toast(result.data.msg);
        SetRefresh(!refresh)
      },
      prefill: {
        name: "Dream Home",
        email: "nayeem2281998@gmail.com",
        contact: "9999999999",
      },
      notes: {
        address: "Dream Home Office",
      },
      theme: {
        color: "#61dafb",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  const paymentManager = async (plan) => {
    await setPlanId(plan._id);
    SetDuration(plan.duration);
    if (plan.Amount === 0) {
      try {
        let res = await axiosInstance.post("/freeTrial", plan); // Log the response to the console
        if (res.status === 201 && res.data.message === "Your free trial has expired") {
          toast.error("Your free trial has expired");
        }
        else{
          SetRefresh(!refresh)
        }
      } catch (error) {
        console.log(error)
        toast.error(error.message);
      }
    } else {
      const val={amount:(plan.Amount * (100 - plan.Discount)) / 100,Planid:plan._id,duration:plan.duration}
      displayRazorpay(val);
    }
  };

  const detailsPreview = () => {
    SetPlanPreview(false);
  };
  const PlansPreview = () => {
    SetPlanPreview(true);
  };

  return (
    <div className=" pt-24 flex justify-center">
      <div className="w-5/6 h-fll  rounded-md mb-12 shadow-xl flex-col ">
        <div className="h-24 w-full ">
          <p className="flex justify-center text-xl p-2 font-bold text-cyan-950">
            {" "}
            Discover Our Premium Plans
          </p>
          {paidPlan.length > 0 && (
            <p className="flex justify-center text-sm p-2 font-bold text-cyan-950">
              Premium remaining: {remainingTime}
            </p>
          )}
        </div>
        <div className="flex justify-center">
          <button
            className={
              " rounded-t-lg p-3 text-cyan-950" +
              (planPreview ? " bg-gray-200 font-bold " : "")
            }
            onClick={PlansPreview}
          >
            Plans
          </button>
          <button
            className={
              " rounded-t-lg p-2 text-cyan-950" +
              (!planPreview ? " bg-gray-200 font-bold" : "")
            }
            onClick={detailsPreview}
          >
            Why should?
          </button>
        </div>
        {planPreview ? (
          <div className="px-6 mb-8 text-cyan-950">
            {plans.length > 0 ? (
              plans.map((plan) => (
                <div
                  className="rounded-md mb-2 shadow-sm bg-gray-200 p-6 flex justify-between"
                  key={plan.id}
                >
                  <p className="text-lg font-bold ">{plan.Heading}</p>
                  <div className="flex jusitfy-between ">
                    {plan.Amount > 0 ? (
                      <>
                        <div className="w-12 flex justify-center mx-2">
                          <span className="font-bold  line-through mx-2 opacity-80">
                            ₹{plan.Amount}
                          </span>
                        </div>
                        <div className="w-24 flex justify-center mr-4">
                          <span className="ml-3  text-xl font-semibold text-blue-600/100 dark:text-mainColor">
                            ₹{(plan.Amount * (100 - plan.Discount)) / 100}
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="w-24 flex justify-center">
                        <span className="ml-3 text-xl font-semibold text-blue-600/100 dark:text-mainColor">
                          ₹{(plan.Amount * (100 - plan.Discount)) / 100}
                        </span>
                      </div>
                    )}
                    {paidPlan.length > 0 ? (
                      paidPlan[0].planId == plan._id ? (
                        <p>Applied</p>
                      ) : <div className="w-12"></div>
                    ) : (
                      <button
                        onClick={() => paymentManager(plan)}
                        type="button"
                        className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                      >
                        Apply
                      </button>
                      )}
                  </div>
                </div>
              ))
            ) : (
              <div>There are no active plans to display</div>
            )}
          </div>
        ) : (
          <div className="px-6 text-cyan-950">
            {/* text of plan details */}
            <p className="p-12 mb-6 bg-gray-200 rounded-lg shadow ">
              Embarking on your journey to find your dream home is an exciting
              and life-changing moment. At Dream Home, we understand the
              significance of this quest, and we're dedicated to enhancing your
              experience in every way possible. That's why we offer the
              exclusive Dream Home Premium account.
              <br />
              <br />
              With Dream Home Premium, you don't just search for homes; you
              forge meaningful connections. The standout feature of our premium
              account is the ability to chat with anyone, anytime. Imagine
              having direct access to home sellers, fellow buyers, or real
              estate professionals, all at your fingertips. It's a level of
              convenience and opportunity that makes your search more
              personalized and efficient.
              <br />
              <br />
              But that's not all. Dream Home Premium is your golden ticket to a
              host of other benefits. You'll enjoy priority notifications on new
              listings, get early access to open houses, and receive expert
              advice and insights from our real estate professionals. Your
              home-buying journey becomes smoother, more informed, and genuinely
              enjoyable.
              <br />
              <br />
              Plus, the premium account comes with an ad-free, uninterrupted
              browsing experience. Say goodbye to distractions and ads
              cluttering your screen. Focus on what matters most - your dream
              home.
              <br />
              <br />
              It's time to unlock the full potential of your home search.
              Upgrade to Dream Home Premium today, and experience the
              difference. Your dream home and a vibrant community of like-minded
              individuals are just a chat away. Don't wait; take the premium
              path to your dream home journey and make every connection count.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PremiumPage;

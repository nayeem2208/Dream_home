import premiumPaidModel from "../modals/PaidPremiumPlans.js";
import premiumModel from "../modals/premiumModel.js";
import Razorpay from "razorpay";

const userGetAllpremiumPlans = async (req, res) => {
  try {
    const plans = await premiumModel.find({ isActive: true });
    const currentDate = new Date();
    let paidPlans = await premiumPaidModel.find({
      UserId: req.user._id,
      Expiry: { $gt: currentDate },
    })

    console.log(paidPlans, "plansss");

    res.status(200).json({plans,paidPlans});
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

const RazorpayPayment = async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });
    console.log(req.body)
    const options = {
      amount: req.body.amount * 100, // amount in smallest currency unit
      currency: "INR",
      receipt: "nayeem670@gmail.com",
    };
    const order = await instance.orders.create(options);
    if (!order) return res.status(500).send("Some error occured");

    res.json({order,planId:req.body.Planid,duration:req.body.duration});
  } catch (error) {
    res.status(500).send(error);
  }
};

const paymentSuccess = async (req, res) => {
  try {
    console.log(req.body, "body");
    const { planId, amount, duration} = req.body;

    const plan = await premiumModel.findOne({ _id: planId });
    console.log('this line 11')
    const currentDate = new Date();
    const durationInMilliseconds = parseInt(duration) * 24 * 60 * 60 * 1000;
    const expirationDate = new Date(
      currentDate.getTime() + durationInMilliseconds
    );
    console.log(currentDate,'currentDate')
    console.log(duration,'duration')
    console.log(expirationDate,'expiry')
    let Amount=amount/100
    const premium = await premiumPaidModel.create({
      UserId: req.user._id,
      planId: plan._id,
      Expiry: expirationDate,
      Amount:Amount
    });
    console.log('this line 33')
    res.json({
      msg: "Premium Activated",
      premium
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

const freeTrial = async (req, res) => {
  try {
    let check = await premiumPaidModel.findOne({
      UserId: req.user._id,
      planId: req.body._id,
    });
    if (check) {
      res.status(201).json({ message: "Your free trial has expired" });
    } else {
      const currentDate = new Date();
      const durationInMilliseconds =
        parseInt(req.body.duration) * 24 * 60 * 60 * 1000;
      const expirationDate = new Date(
        currentDate.getTime() + durationInMilliseconds
      );
      let plan = await premiumPaidModel.create({
        UserId: req.user._id,
        planId: req.body._id,
        Expiry: expirationDate,
      });
      res.status(200).json(plan);
    }
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

export { userGetAllpremiumPlans, RazorpayPayment, paymentSuccess, freeTrial };

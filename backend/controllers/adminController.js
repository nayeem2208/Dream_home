import adminModel from "../modals/adminModel.js";
import postModel from "../modals/postModel.js";
import postModal from "../modals/postModel.js";
import premiumModel from "../modals/premiumModel.js";
import usermodel from "../modals/userModal.js";
import generateToken from "../utils/adminJwt.js";
import paidPremiumModel from "../modals/PaidPremiumPlans.js";

const adminLogin = async (req, res) => {
  const { username, password } = req.body;
  const admin = await adminModel.findOne({ username });
  if (admin) {
    if (admin.password == password) {
      const token = generateToken(res, admin._id);
      res.status(200).json({ username, password, token });
    } else {
      res.status(400).json({ error: "Invalid passord" });
    }
  } else {
    res.status(400).json({ error: "Invalid Admin" });
  }
};

const adminLogout = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json("logut success");
  } catch (error) {
    res.status(400).json({ error });
  }
};

const check = (req, res) => {
  res.status(200).json("its working macha");
};

const userPost = async (req, res) => {
  try {
    const post = await postModel.aggregate([
      {
        $sort: { dateOfPosted: -1 }, // Sort the posts by dateOfPosted in descending order
      },
      {
        $lookup: {
          from: "users", // The name of the User collection
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user", // Convert the user array to an object
      },
      {
        $project: {
          _id: 1,
          heading: 1,
          description: 1,
          service: 1,
          dateOfPosted: {
            $dateToString: {
              format: "%Y-%m-%d", // Format to display only the date
              date: "$dateOfPosted",
              timezone: "Asia/Kolkata", // Set the desired timezone (Indian Standard Time)
            },
          },
          likes: 1,
          comments: 1,
          media: 1,
          "user.username": 1,
          "user.profilePic": 1,
          isBlocked: 1,
        },
      },
    ]);
    res.status(200).json(post);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const postBlock = async (req, res) => {
  try {
    const { postId } = req.query;
    let post = await postModal.findOne({ _id: postId });
    if (post.isBlocked) {
      post.isBlocked = false;
      await post.save();
      res.status(200).json("unblocked");
    } else {
      post.isBlocked = true;
      await post.save();
      res.status(200).json("blocked");
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const getUser = async (req, res) => {
  try {
    const user = await usermodel.find({});
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const userblockmanagement = async (req, res) => {
  try {
    let userblock = await usermodel.findOne({ _id: req.query.id });
    if (userblock.isBlocked) {
      userblock.isBlocked = false;
    } else {
      userblock.isBlocked = true;
    }
    await userblock.save();
    const user = await usermodel.find({});
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const getPremiumPlan = async (req, res) => {
  try {
    const premiumplans = await premiumModel.find({});
    res.status(200).json(premiumplans);
  } catch (error) {
    console.log(error.message);
    res.status(400).json(error.message);
  }
};

const AddpremiumPlans = async (req, res) => {
  try {
    const { heading, Amount, Discount, Duration } = req.body;
    const plan = await premiumModel.create({
      Heading: heading,
      Amount: Amount,
      Discount: Discount,
      duration: Duration,
    });
    res.status(200).json(plan);
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

const EditPremiumPlan = async (req, res) => {
  try {
    const { id, heading, Amount, Discount, Duration } = req.body;
    await premiumModel.findByIdAndUpdate(id, {
      Heading: heading,
      Amount: Amount,
      Discount: Discount,
      duration: Duration,
    });

    const allPlans = await premiumModel.find({});
    res.status(200).json(allPlans);
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

const ToggleAcitveDeactivatePlan = async (req, res) => {
  try {
    const id = req.body._id;
    let isActive = req.body.isActive == true ? false : true;
    await premiumModel.findByIdAndUpdate(id, {
      isActive: isActive,
    });
    const allPlans = await premiumModel.find({});
    res.status(200).json(allPlans);
  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

const getAllSales = async (req, res) => {
  try {
    let sales = await paidPremiumModel.aggregate([
      {
        $match: {
          planId: { $ne: "6532c32ce5395520db7c6991" },
        },
      },
      {
        $lookup: {
          from: "premiumplans",
          localField: "planId",
          foreignField: "_id",
          as: "Plan",
        },
      },
      {
        $unwind: "$Plan",
      },
      {
        $lookup: {
          from: "users",
          localField: "UserId",
          foreignField: "_id",
          as: "UserDetails",
        },
      },
      {
        $unwind: "$UserDetails",
      },
      {
        $project: {
          "UserDetails.username": 1,
          "UserDetails.profilePic": 1,
          "Plan.Amount": 1,
          "Plan.Heading": 1,
          "Plan.Discount": 1,
          createdAT: 1,
          Amount: 1,
        },
      },
    ]);
    res.status(200).json(sales);
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

const adminDashboard = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let sales = await paidPremiumModel.aggregate([
      {
        $match: {
          createdAT: {
            $gte: new Date(currentYear, 0, 1), // Start of the current year
            $lt: new Date(currentYear + 1, 0, 1), // Start of the next year
          },
        },
      },
      {
        $project: {
          month: { $month: "$createdAT" },
          Amount: 1,
        },
      },
      {
        $group: {
          _id: "$month",
          totalAmount: { $sum: "$Amount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const salesByMonth = sales.reduce((acc, data) => {
      acc[data._id - 1] = data.totalAmount;
      return acc;
    }, Array.from({ length: 12 }).fill(0));

    const formattedData = months.map((month, index) => ({
      month,
      totalAmount: salesByMonth[index],
    }));

    let yearSale=await paidPremiumModel.aggregate([
      {
        $match: {
          "createdAT": {
            $gte: new Date(currentYear, 0, 1),  // Start of the current year
            $lt: new Date(currentYear + 1, 0, 1) // Start of the next year
          }
        }
      },
      {
        $project: {
          year: { $year: "$createdAT" },
          Amount: 1
        }
      },
      {
        $group: {
          _id: { year: "$year", month: "$month" },
          totalSales: { $sum: "$Amount" }
        }
      },
      {
        $sort: { "_id.month": 1 }
      }
    ]);
    const totalUsers=await usermodel.find({})
    res.status(200).json({formattedData,yearSale:yearSale[0].totalSales,totalUsers})
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

export {
  adminLogin,
  adminLogout,
  check,
  userPost,
  postBlock,
  getUser,
  userblockmanagement,
  getPremiumPlan,
  AddpremiumPlans,
  EditPremiumPlan,
  ToggleAcitveDeactivatePlan,
  getAllSales,
  adminDashboard,
};

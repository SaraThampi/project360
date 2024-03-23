import { UserModel } from "../models/models.js";

export async function addUserController(req, res) {
  const newUser = req.body;
  try {
    const userData = await UserModel.create(newUser);
    res.status(201).json({ status: "success", data: userData });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
}

export async function getAllUsers(req, res) {
  try {
    const userData = await UserModel.find();
    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
}

export async function loginUser(req, res) {
  try {
    const { name, email, password } = req.body;
    // Check if the user exists
    const user = await UserModel.findOne({ name }); // can change to email instead
    if (!user) {
      return res.status(401).json({ error: "Invalid username" });
    }
    // Validate the password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }
    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, "secretKey");

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "An error occurred while logging in" });
  }
}

// Authentication middleware
export function authenticateUser(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];

    // Verify the token
    const decodedToken = jwt.verify(token, "secretKey");

    // Attach the user ID to the request object
    req.userId = decodedToken.userId;

    next();
  } catch (error) {
    console.error("Error authenticating user:", error);
    res.status(401).json({ error: "Unauthorized" });
  }
};


// Authorization middleware
export const authoriseUser = (requiredRole) => async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (user.role !== requiredRole) {
      return res.status(403).json({ error: "Forbidden" });
    }

    next();
  } catch (error) {
    console.error("Error authorizing user:", error);
    res
      .status(500)
      .json({ error: "An error occurred while authorizing the user" });
  }
};


export function dashboardLogic(req, res, next) {
    console.log("dashboard logic");
    next();
}
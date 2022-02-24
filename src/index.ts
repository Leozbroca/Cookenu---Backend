import app from "./app";
import createUser from './endpoints/signup'
import login from "./endpoints/login"
import getProfile from "./endpoints/profileInfo";
import createRecipe from "./endpoints/createRecipe"
import getOtherProfile from "./endpoints/otherProfileInfo"
import getRecipe from "./endpoints/getRecipe"
import followUser from "./endpoints/followUser";
import unfollowUser from "./endpoints/unfollowUser"
import getFeed from "./endpoints/getFeed";
import editRecipe from "./endpoints/editRecipe";
import deleteRecipe from "./endpoints/deleteRecipe";
import deleteUser from "./endpoints/deleteUser";
import { forgotEmail } from "./endpoints/forgotEmail";

app.post("/signup", createUser)
app.post("/login", login)
app.get("/user/feed", getFeed)
app.get("/user/profile", getProfile)
app.post("/recipe", createRecipe)
app.post("/user/follow", followUser)
app.delete("/user/unfollow", unfollowUser)
app.put("/newPassword", forgotEmail)
app.get("/user/:id", getOtherProfile)
app.get("/recipe/:id", getRecipe)
app.put("/recipe/:id/edit", editRecipe)
app.delete("/recipe/:id/delete", deleteRecipe)
app.delete("/user/:id/delete", deleteUser)






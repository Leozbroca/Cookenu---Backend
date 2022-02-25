import app from "./app";
import userController from "./controller/userController"
import recipeController from "./controller/recipeController"
import followController from "./controller/followController"

// Requisições de usuários
app.post("/signup", userController.signup)
app.post("/login", userController.login)
app.get("/user/feed", userController.getFeed)
app.get("/user/profile",userController.getProfile)
app.put("/newPassword", userController.forgotPassword)
app.get("/user/:id", userController.getOtherProfile)
app.delete("/user/:id/delete", userController.deleteUser)

// Requisições de receita
app.post("/recipe", recipeController.createRecipe)
app.get("/recipe/:id", recipeController.getRecipe)
app.put("/recipe/:id/edit", recipeController.editRecipe)
app.delete("/recipe/:id/delete", recipeController.deleteRecipe)

// Requisições de seguidores
app.post("/user/follow", followController.followUser)
app.delete("/user/unfollow", followController.unfollowUser)









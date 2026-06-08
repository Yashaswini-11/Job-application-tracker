const mongoose = require("mongoose");

mongoose.connect(
  "mongodb://Jobtrackeruser:Jungkook01@ac-8wg9k8w-shard-00-00.zcfyohz.mongodb.net:27017,ac-8wg9k8w-shard-00-01.zcfyohz.mongodb.net:27017,ac-8wg9k8w-shard-00-02.zcfyohz.mongodb.net:27017/?ssl=true&replicaSet=atlas-11kfvz-shard-0&authSource=admin&appName=Cluster0"
)
.then(() => {
  console.log("MongoDB Connected");
  process.exit();
})
.catch((err) => {
  console.log("Mongo Error:", err);
  process.exit();
});
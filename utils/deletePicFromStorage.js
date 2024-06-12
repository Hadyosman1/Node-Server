const { firebaseStorage } = require("../config/firebase.conofig");
const { ref, deleteObject } = require("firebase/storage");
module.exports = async (picUrl) => {
  try {
    const path = decodeURIComponent(picUrl.split("/o/")[1].split("?")[0]);
    if (path !== "images/anonymous_user.webp") {

      const storageRef = ref(firebaseStorage, path);
      const result = await deleteObject(storageRef);
      console.log("result ===>", result);
    }
  } catch (error) {
    console.log("error ===>", error.message);
  }
};

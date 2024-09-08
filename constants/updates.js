import * as Updates from "expo-updates";

export const checkForUpdates = async () => {
  try {
    const updates = await Updates.checkForUpdateAsync();
    if (updates.isAvailable) {
      return true
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};

export const downloadUpdates = async () => {
  try {
    const update = await Updates.fetchUpdateAsync();
    if(update.isNew){
      await Updates.reloadAsync();
    }
  } catch (error) {
    console.log(error)
  }
}
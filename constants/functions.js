import { NativeModules } from "react-native";
const { GoogleAuthModule } = NativeModules;

export const googleSignIn = () => {
    return new Promise((resolve, reject) => {
      GoogleAuthModule.signIn(
        (userDetails) => {
          const user = JSON.parse(userDetails);
          console.log("User Details", user);
          resolve(user);
        },
        (error) => {
          console.error(error);
          reject();
        }
      );
    });
};

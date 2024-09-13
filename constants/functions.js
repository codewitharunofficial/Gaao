import { NativeModules } from "react-native";
const { GoogleAuthModule } = NativeModules;

export const googleSignIn = () => {
    return new Promise((resolve, reject) => {
      GoogleAuthModule.signIn(
        (userDetails) => {
          resolve(userDetails);
        },
        (error) => {
          console.error(error);
          reject();
        }
      );
    });
};

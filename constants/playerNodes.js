import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library'

// export const playVocals = async (uri) => {
//     try {
//         const {sound, status} = await Audio.Sound.createAsync({uri: url});
//          await sound.playAsync();
//          setIsMusicPlaying(true);
//          setSound(sound);

//          async function unload(status) {
//            try {
//             if(status.didJustFinish){
//               await sound.unloadAsync();
//               setIsMusicPlaying(false);
//             }
//            } catch (error) {
//             console.log(error)
//            }
//          }

//         sound.setOnPlaybackStatusUpdate((status) => {
//           if(status.didJustFinish){
//             unload(status);
//           }
//          })
//     } catch (error) {
//         console.log(error);
//     }
// }

// export const pauseVocals = async () => {
//   try {
//     await sound.pauseAsync();
//     setIsMusicPlaying(false);
//     setIsPaused(true);
//   } catch (error) {
//     console.log(error)
//   }
// }

export const createDirectories = async () => {
    try {
        const response = await MediaLibrary.getPermissionsAsync();
        if(response.granted){
            console.log("Permission Granted");
        }
        
       const rootPath = FileSystem.documentDirectory.split('com.codewitharun.gaao')[0];

       const folderPath = `${rootPath}Gaao`;


       const folderInfo = await FileSystem.getInfoAsync(folderPath);

       console.log(folderInfo);

       const dowloads = await MediaLibrary.getAlbumAsync('Download');
       const Gaao = await  MediaLibrary.createAlbumAsync("Gaao", "Vocals");

       const gaao = await MediaLibrary.getAlbumAsync("Gaao");

       console.log("Gaao" + gaao)

       
        
        

        if(!folderInfo.exists){
            await FileSystem.makeDirectoryAsync(folderPath);
        }
    } catch (error) {
        console.log(error);
    }
}
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
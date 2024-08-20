import { createContext, useContext, useState } from "react";

const RecordedTrack = createContext();

const RecordingContext = ({children}) => {

    const [recordedTrack, setRecordedTrack] = useState({});
    const [vocals, setVocals] = useState();
    // const [position, setPosition] = useState(0);

    return (

    <RecordedTrack.Provider value={{recordedTrack, setRecordedTrack, vocals, setVocals}} >
      {children}
    </RecordedTrack.Provider>
    )


}

export {RecordedTrack, RecordingContext};
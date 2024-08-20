import { createContext, useContext, useState } from "react";

const RecordedTrack = createContext();

const RecordingContext = ({children}) => {

    const [recordedTrack, setRecordedTrack] = useState({});
    const [vocals, setVocals] = useState();
    const [processedVocals, setProcessedVocals] = useState();

    return (

    <RecordedTrack.Provider value={{recordedTrack, setRecordedTrack, vocals, setVocals, processedVocals, setProcessedVocals}} >
      {children}
    </RecordedTrack.Provider>
    )


}

export {RecordedTrack, RecordingContext};
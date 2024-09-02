import React, { useState, useEffect } from 'react';
import './audio.css';
import SourceElement from './component/AudioSource';

import BGM1 from './異世界の始まり.mp3';
import BGM2 from './epilogue.mp3';
import BGM3 from './H.mp3';
import BGM4 from './title.mp3';
import BGM5 from './ナグルファルの船上にて -Piano Ver.-.mp3';
// import BGM6 from './za-warudo-stop-time-sound.mp3';

var bgmList = [BGM1, BGM2, BGM3, BGM4, BGM5];

const AudioControl = ({ onPlayNext, onStop, onPlay }) => (
    <div className="audio-controls">
        <button onClick={onStop}>Stop</button>
        <button onClick={onPlay}>Play</button>
        <button onClick={onPlayNext}>Next</button>
    </div>
);

const Audio = () => {
    const [selectedBGM, setSelectedBGM] = useState(null);

    function random() {
        const randomIndex = Math.floor(Math.random() * bgmList.length);
        setSelectedBGM(bgmList[randomIndex]);
        // console.log(bgmList[5]);
    };

    const handlePlayNext = () => {
        random();
    };

    const handleStop = () => {
        const audioElement = document.getElementById('audio-container');
        audioElement.pause();
        audioElement.currentTime = 0;
    };

    const handleStart = () => {
        const audioElement = document.getElementById('audio-container');
        audioElement.play();
    }

    useEffect(() => {
        random();
        // console.log(bgmList[5]);
    }, []);

    useEffect(() => {
        if (selectedBGM) {
            const audioElement = document.getElementById('audio-container');

            audioElement.src = selectedBGM;
            audioElement.load();

            const handleEnded = () => {
                random();
                audioElement.removeEventListener('ended', handleEnded);
            };

            audioElement.addEventListener('ended', handleEnded);

            bgmList.pop();
        }

    }, [selectedBGM]);

    return (
        <div className='audio-container'>
            <audio id="audio-container" controls autoPlay>
                <SourceElement src={selectedBGM} type="audio/mpeg" />
            </audio>

            <AudioControl onPlayNext={handlePlayNext} onStop={handleStop} onPlay={handleStart} />

        </div>
    );
};

export default Audio;
import React, { useState, useRef, useMemo } from 'react';
import Scanner from '../components/Scanner';
import Result from '../components/Result';

import './book2.css';

const App = () => {
    const [scanning, setScanning] = useState(false);
    const [results, setResults] = useState([{
        codeResult: {
            code: 123,
            format: 'ean',
        },
    }]);
    const scannerRef = useRef(null);
    const [cameras, setCameras] = useState([]);
    const [selectedCamera, setSelectedCamera] = useState('');

    useMemo(() => {
        navigator.mediaDevices.enumerateDevices({
            audio: true,
            video: {
                facingMode: {
                    exact: "environment",
                },
            },
        })
            .then(function(devices) {
                setCameras(devices.filter(device => device.kind === 'videoinput'));
            })
            .catch(function(err) {
                console.log(err.name + ": " + err.message);
            });
    }, []);

    const handleCameraSelect = (event) => {
        setSelectedCamera(event.target.value);
    };

    return (
        <div>
            <button onClick={() => setScanning(!scanning) }>{scanning ? 'Stop' : 'Start'}</button>
            <select
                 value={selectedCamera}
                 onChange={handleCameraSelect}
            >
                {cameras && cameras.map((camera) => {
                    const displayName = camera.label || camera.deviceId;
                    return <option
                        label = {displayName}
                        key = {`device-select-${camera.deviceId}`}
                        value = {camera.deviceId}
                    >{displayName}</option>
                })}
            </select>
            {/* <pre>{JSON.stringify(cameras, null, 4)}</pre> */}
            <div
                className='scanner-wrapper'
            >
                <div
                    ref={scannerRef}
                    style={{
                        position: 'relative',
                        // border: '3px solid red',
                        maxWidth: '50%',
                        margin: '0 auto',
                    }}
                >
                    {/* <video style={{ width: window.innerWidth, height: 480, border: '3px solid orange' }}/> */}
                    <canvas className="drawingBuffer" style={{
                        position: 'absolute',
                        top: '0px',
                        // left: '0px',
                        // height: '100%',
                        // width: '100%',
                        border: '3px solid green',
                    }} width="640" height="480" />
                    {scanning ? <Scanner
                        scannerRef={scannerRef}
                        cameraId={selectedCamera}
                        facingMode={'user'}
                        onDetected={(result) => setResults([...results, result])}
                    /> : null}
                </div>
                <ul className="results">
                    {results.map((result) => (result.codeResult &&
                        <Result
                            key={result.codeResult.code}
                            result={result}
                        />))}
                </ul>
            </div>
        </div>
    );
};

export default App;
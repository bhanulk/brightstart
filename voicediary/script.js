let mediaRecorder;
let audioChunks = [];
const startRecordButton = document.getElementById('startRecord');
const stopRecordButton = document.getElementById('stopRecord');
const playAudioButton = document.getElementById('playAudio');
const saveAudioButton = document.getElementById('saveAudio');
const audioPlayback = document.getElementById('audioPlayback');

startRecordButton.addEventListener('click', () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();

            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                audioPlayback.src = audioUrl;
                playAudioButton.disabled = false;
                saveAudioButton.disabled = false;
            };

            startRecordButton.disabled = true;
            stopRecordButton.disabled = false;
        })
        .catch(error => {
            console.error("Error accessing microphone:", error);
        });
});

stopRecordButton.addEventListener('click', () => {
    mediaRecorder.stop();
    startRecordButton.disabled = false;
    stopRecordButton.disabled = true;
});

playAudioButton.addEventListener('click', () => {
    audioPlayback.play();
});

saveAudioButton.addEventListener('click', () => {
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'voice_diary.wav';
    a.click();
});
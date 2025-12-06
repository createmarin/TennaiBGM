// --- 1. HTML要素の取得 ---
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const repeatBtn = document.getElementById('repeat-btn');
const trackTitle = document.getElementById('track-title');
const trackArtist = document.getElementById('track-artist');
const progressContainer = document.querySelector('.progress-container');
const progress = document.querySelector('.progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');

// --- 2. 音楽データとプレイヤーの状態管理 ---
const songs = [
    { title: '晴れやかな朝', artist: 'BGM作家1', filePath: '/TennaiBGM/musics/BGM1.mp3' },
    { title: '午後のカフェテラス', artist: 'BGM作家2', filePath: '/TennaiBGM/musics/BGM2.mp3' },
    { title: '星降る夜に', artist: 'BGM作家3', filePath: '/TennaiBGM/musics/BGM3.mp3' }
];

let songIndex = 0;
const audio = new Audio();
let isPlaying = false;
let isShuffle = false;
let repeatMode = 0; // 0:OFF, 1:全曲リピート, 2:1曲リピート


// --- 3. 機能ごとの関数を定義 ---

function loadSong() {
    const currentSong = songs[songIndex];
    trackTitle.textContent = currentSong.title;
    trackArtist.textContent = currentSong.artist;
    audio.src = currentSong.filePath;
}

function playSong() {
    isPlaying = true;
    playPauseBtn.querySelector('i').classList.remove('fa-play');
    playPauseBtn.querySelector('i').classList.add('fa-pause');
    audio.play();
}

function pauseSong() {
    isPlaying = false;
    playPauseBtn.querySelector('i').classList.remove('fa-pause');
    playPauseBtn.querySelector('i').classList.add('fa-play');
    audio.pause();
}

function prevSong() {
    songIndex--;
    if (songIndex < 0) {
        songIndex = songs.length - 1;
    }
    loadSong();
    playSong();
}

function nextSong() {
    if (isShuffle) {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * songs.length);
        } while (randomIndex === songIndex);
        songIndex = randomIndex;
    } else {
        songIndex++;
        if (songIndex > songs.length - 1) {
            songIndex = 0;
        }
    }
    loadSong();
    playSong();
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');
    return `${minutes}:${formattedSeconds}`;
}

function updateProgressBar(e) {
    const { duration, currentTime } = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
    currentTimeEl.textContent = formatTime(currentTime);
}

function setProgressBar(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    if (!isNaN(duration)) {
        audio.currentTime = (clickX / width) * duration;
    }
}


// --- 4. イベントリスナーの設定 ---

playPauseBtn.addEventListener('click', () => { isPlaying ? pauseSong() : playSong(); });
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active', isShuffle);
});

// [Modified!] アイコンが消えるバグを修正したリピートボタンの処理
repeatBtn.addEventListener('click', () => {
    repeatMode = (repeatMode + 1) % 3;
    
    // アイコンの表示を切り替える
    const repeatIcon = repeatBtn.querySelector('i');
    switch (repeatMode) {
        case 0: // OFF
            repeatBtn.classList.remove('active');
            // 備考: 1曲リピート用のアイコン表示は、FontAwesomeのバージョンによっては工夫が必要なため、
            // 今回は「色」だけで状態を示す、よりシンプルで確実な方法にします。
            // アイコン自体は変えないことで、消えるバグを防ぎます。
            break;
        case 1: // 全曲リピート
            repeatBtn.classList.add('active');
            break;
        case 2: // 1曲リピート
            repeatBtn.classList.add('active');
            // ここでアイコンを変えようとしたのがバグの原因でした。
            // アイコンは変えずに、色だけアクティブなままにします。
            break;
    }
});

audio.addEventListener('timeupdate', updateProgressBar);
audio.addEventListener('loadedmetadata', () => { durationEl.textContent = formatTime(audio.duration); });

audio.addEventListener('ended', () => {
    if (repeatMode === 2) { // 1曲リピートの場合
        playSong();
    } else { // 全曲リピートか、リピートOFFの場合
        nextSong();
    }
});
// (※) 上のendedイベントも少しシンプルにしました。全曲リピートがONの場合、nextSongの最後でindexが0に戻るので、これで正常に動作します。


progressContainer.addEventListener('click', setProgressBar);

// --- 5. 初期化処理 ---
loadSong();

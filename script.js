// --- 1. HTML要素の取得 ---
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const trackTitle = document.getElementById('track-title');
const trackArtist = document.getElementById('track-artist');
const progressContainer = document.querySelector('.progress-container');
const progress = document.querySelector('.progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');

// --- 2. 音楽データとプレイヤーの状態管理 ---

// [最終修正版] ファイルパスをリポジトリ名から始まる絶対パスに変更します
const songs = [
    {
        title: '晴れやかな朝',
        artist: 'フリーBGM作家さん',
        filePath: '/TennaiBGM/musics/sample.mp3'
    },
    {
        title: '午後のカフェテラス',
        artist: 'BGMの匠',
        filePath: '/TennaiBGM/musics/sample2.mp3'
    },
    {
        title: '星降る夜に',
        artist: 'Sound Creator',
        filePath: '/TennaiBGM/musics/sample3.mp3'
    }
];

let songIndex = 0;
const audio = new Audio();
let isPlaying = false;

// --- 3. 機能ごとの関数を定義 ---

function loadSong() {
    const currentSong = songs[songIndex];
    // ★デバッグ用：コンソールにどのファイルを読み込もうとしているか表示します
    console.log('Attempting to load file:', currentSong.filePath); 
    trackTitle.textContent = currentSong.title;
    trackArtist.textContent = currentSong.artist;
    audio.src = currentSong.filePath;
}

function playSong() {
    // 再生できる状態になってから再生する
    const playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.then(_ => {
            isPlaying = true;
            playPauseBtn.querySelector('i').classList.remove('fa-play');
            playPauseBtn.querySelector('i').classList.add('fa-pause');
        }).catch(error => {
            // 自動再生がブロックされた場合などに対応
            console.error("Playback failed:", error);
            isPlaying = false;
        });
    }
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
    songIndex++;
    if (songIndex > songs.length - 1) {
        songIndex = 0;
    }
    loadSong();
    playSong();
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00'; // ★バグ対策：NaNの場合は0:00を返す
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
    // ★バグ対策：durationが有効な数値の場合のみ実行
    if (!isNaN(duration)) {
        audio.currentTime = (clickX / width) * duration;
    }
}

// --- 4. イベントリスナーの設定 ---
playPauseBtn.addEventListener('click', () => { isPlaying ? pauseSong() : playSong(); });
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
audio.addEventListener('timeupdate', updateProgressBar);
audio.addEventListener('loadedmetadata', () => { durationEl.textContent = formatTime(audio.duration); });
audio.addEventListener('ended', nextSong);
progressContainer.addEventListener('click', setProgressBar);

// ★★★【重要】エラーを検知してアラートを出す機能 ★★★
audio.addEventListener('error', (e) => {
    const errorSrc = audio.src.substring(audio.src.lastIndexOf('/') + 1);
    alert(`エラー: 音楽ファイルの読み込みに失敗しました！\n\nファイル名: "${errorSrc}"\n\n「musics」フォルダにこの名前のファイルが存在するか確認してください。`);
    console.error("Audio loading error details:", e);
});


// --- 5. 初期化処理 ---
loadSong();

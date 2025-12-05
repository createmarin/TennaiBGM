// --- 1. HTML要素の取得 (追加あり) ---
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn'); // [New!]
const nextBtn = document.getElementById('next-btn'); // [New!]
const trackTitle = document.getElementById('track-title');
const trackArtist = document.getElementById('track-artist');
const progressContainer = document.querySelector('.progress-container');
const progress = document.querySelector('.progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');

// --- 2. 音楽データとプレイヤーの状態管理 (変更あり) ---

// [Modified!] 単一の曲オブジェクトから、曲オブジェクトの配列（プレイリスト）に変更
const songs = [
    {
        title: '木漏れ日',
        artist: 'りょうぼー',
        filePath: 'musics/sample.mp3'
    },
    {
        title: 'シャイニングスター',
        artist: '魔王魂/詩歩',
        filePath: 'musics/sample2.mp3'
    },
    {
        title: '捩花',
        artist: '魔王魂/火ノ岡レイ',
        filePath: 'musics/sample3.mp3'
    }
];

// [New!] 現在どの曲を再生しているかを追跡するためのインデックス
let songIndex = 0;

const audio = new Audio();
let isPlaying = false;

// --- 3. 機能ごとの関数を定義 (追加・変更あり) ---

/**
 * [Modified!] 曲をプレイヤーに読み込む関数
 * グローバル変数の songIndex に基づいて曲を読み込む
 */
function loadSong() {
    const currentSong = songs[songIndex];
    trackTitle.textContent = currentSong.title;
    trackArtist.textContent = currentSong.artist;
    audio.src = currentSong.filePath;
}

/**
 * 曲を再生する関数
 */
function playSong() {
    isPlaying = true;
    playPauseBtn.querySelector('i').classList.remove('fa-play');
    playPauseBtn.querySelector('i').classList.add('fa-pause');
    audio.play();
}

/**
 * 曲を一時停止する関数
 */
function pauseSong() {
    isPlaying = false;
    playPauseBtn.querySelector('i').classList.remove('fa-pause');
    playPauseBtn.querySelector('i').classList.add('fa-play');
    audio.pause();
}

/**
 * [New!] 前の曲へ移動する関数
 */
function prevSong() {
    songIndex--;
    // 最初の曲より前に戻ろうとしたら、最後の曲へループ
    if (songIndex < 0) {
        songIndex = songs.length - 1;
    }
    loadSong();
    playSong();
}

/**
 * [New!] 次の曲へ移動する関数
 */
function nextSong() {
    songIndex++;
    // 最後の曲より先に進もうとしたら、最初の曲へループ
    if (songIndex > songs.length - 1) {
        songIndex = 0;
    }
    loadSong();
    playSong();
}


// (時間整形、プログレスバー更新、シーク機能の関数は変更なし)
function formatTime(seconds) {
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
    audio.currentTime = (clickX / width) * duration;
}


// --- 4. イベントリスナーの設定 (追加・変更あり) ---

// 再生・一時停止ボタンのクリック
playPauseBtn.addEventListener('click', () => {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});

// [New!] 前へ・次へボタンのクリック
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

// 曲の再生時間や情報が更新されるたびに
audio.addEventListener('timeupdate', updateProgressBar);

// 曲のメタデータが読み込み終わったら
audio.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(audio.duration);
});

// [Modified!] 曲が最後まで再生し終わったら、pauseSongではなくnextSongを実行
audio.addEventListener('ended', nextSong);

// プログレスバーコンテナをクリックしたら
progressContainer.addEventListener('click', setProgressBar);

// --- 5. 初期化処理 ---
// 最初の曲を読み込む
loadSong();

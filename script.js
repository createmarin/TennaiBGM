// --- 1. HTML要素の取得 (追加あり) ---
const playPauseBtn = document.getElementById('play-pause-btn');
const trackTitle = document.getElementById('track-title');
const trackArtist = document.getElementById('track-artist');
const progressContainer = document.querySelector('.progress-container');
const progressBar = document.querySelector('.progress-bar');
const progress = document.querySelector('.progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');

// --- 2. 音楽データとプレイヤーの状態管理 ---
const song = {
    title: '晴れやかな朝',
    artist: 'フリーBGM作家さん',
    filePath: 'musics/sample.mp3'
};
const audio = new Audio();
let isPlaying = false;

// --- 3. 機能ごとの関数を定義 (追加・変更あり) ---

/**
 * 曲をプレイヤーに読み込む関数
 */
function loadSong(songData) {
    trackTitle.textContent = songData.title;
    trackArtist.textContent = songData.artist;
    audio.src = songData.filePath;
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
 * [New!] 時間を整形する関数 (例: 80秒 -> "1:20")
 * @param {number} seconds - 秒数
 * @returns {string} - "分:秒" 形式の文字列
 */
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    // 秒が1桁の場合、前に0を付ける (例: 5 -> "05")
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');
    return `${minutes}:${formattedSeconds}`;
}

/**
 * [New!] プログレスバーと時間表示を更新する関数
 * @param {Event} e - timeupdateイベントオブジェクト
 */
function updateProgressBar(e) {
    // audio要素から現在の再生時間(currentTime)と曲の全長(duration)を取得
    const { duration, currentTime } = e.srcElement;
    
    // プログレスバーの幅を計算 (再生率 %)
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;

    // 時間表示を更新
    currentTimeEl.textContent = formatTime(currentTime);
}

/**
 * [New!] プログレスバーをクリックしたときに再生位置を変更する関数
 * @param {Event} e - clickイベントオブジェクト
 */
function setProgressBar(e) {
    // プログレスバー全体の幅を取得
    const width = this.clientWidth;
    // バーのどこをクリックしたか、左端からの距離(px)を取得
    const clickX = e.offsetX;
    // 曲の全長を取得
    const duration = audio.duration;
    
    // クリック位置から計算して、再生時間を設定
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

// [New!] 曲の再生時間や情報が更新されるたびに、updateProgressBar関数を実行
audio.addEventListener('timeupdate', updateProgressBar);

// [New!] 曲のメタデータ（長さなど）が読み込み終わったら、全長時間を表示
audio.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(audio.duration);
});

// [New!] 曲が最後まで再生し終わったら、pauseSong関数を実行してアイコンを戻す
audio.addEventListener('ended', pauseSong);

// [New!] プログレスバーコンテナをクリックしたら、setProgressBar関数を実行
progressContainer.addEventListener('click', setProgressBar);

// --- 5. 初期化処理 ---
loadSong(song);

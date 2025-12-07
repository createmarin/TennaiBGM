// --- 1. HTML要素の取得 ---
// プレイヤー機能の要素
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

// [New!] 画面表示を切り替えるための要素
const playerView = document.getElementById('player-view');
const playlistsView = document.getElementById('playlists-view');
const menuPlayer = document.getElementById('menu-player');
const menuPlaylists = document.getElementById('menu-playlists');


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
let repeatMode = 0;


// --- 3. 機能ごとの関数を定義 ---

// [New!] 画面を切り替える関数
function switchView(viewName) {
    // まずは全ての画面を隠し、全てのメニューの選択状態を解除
    playerView.style.display = 'none';
    playlistsView.style.display = 'none';
    menuPlayer.classList.remove('active');
    menuPlaylists.classList.remove('active');

    // 指定された画面を表示し、対応するメニューを選択状態にする
    if (viewName === 'player') {
        playerView.style.display = 'block';
        menuPlayer.classList.add('active');
    } else if (viewName === 'playlists') {
        playlistsView.style.display = 'block';
        menuPlaylists.classList.add('active');
    }
}


// ▼▼▼ ここから下は、前回作成したプレイヤー機能の関数です（変更なし） ▼▼▼
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
    if (songIndex < 0) { songIndex = songs.length - 1; }
    loadSong(); playSong();
}
function nextSong() {
    if (isShuffle) {
        let randomIndex;
        do { randomIndex = Math.floor(Math.random() * songs.length); } while (randomIndex === songIndex);
        songIndex = randomIndex;
    } else {
        songIndex++;
        if (songIndex > songs.length - 1) { songIndex = 0; }
    }
    loadSong(); playSong();
}
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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
    if (!isNaN(duration)) { audio.currentTime = (clickX / width) * duration; }
}
// ▲▲▲ ここまでプレイヤー機能の関数 ▲▲▲


// --- 4. イベントリスナーの設定 ---

// [New!] メニューボタンのクリックイベント
menuPlayer.addEventListener('click', () => switchView('player'));
menuPlaylists.addEventListener('click', () => switchView('playlists'));


// ▼▼▼ ここから下は、前回作成したプレイヤー機能のイベントリスナーです（変更なし） ▼▼▼
playPauseBtn.addEventListener('click', () => { isPlaying ? pauseSong() : playSong(); });
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active', isShuffle);
});
repeatBtn.addEventListener('click', () => {
    repeatMode = (repeatMode + 1) % 3;
    const isActive = repeatMode !== 0;
    repeatBtn.classList.toggle('active', isActive);
});
audio.addEventListener('timeupdate', updateProgressBar);
audio.addEventListener('loadedmetadata', () => { durationEl.textContent = formatTime(audio.duration); });
audio.addEventListener('ended', () => {
    if (repeatMode === 2) { playSong(); } 
    else { nextSong(); }
});
progressContainer.addEventListener('click', setProgressBar);
// ▲▲▲ ここまでプレイヤー機能のイベントリスナー ▲▲▲


// --- 5. 初期化処理 ---
loadSong(); // 最初に再生する曲を読み込んでおく
// (初期表示はHTML側で制御しているので、JSでの表示命令は不要)

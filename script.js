// --- 1. HTML要素の取得 (追加あり) ---
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const shuffleBtn = document.getElementById('shuffle-btn'); // [New!]
const repeatBtn = document.getElementById('repeat-btn');   // [New!]
const trackTitle = document.getElementById('track-title');
const trackArtist = document.getElementById('track-artist');
const progressContainer = document.querySelector('.progress-container');
const progress = document.querySelector('.progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');

// --- 2. 音楽データとプレイヤーの状態管理 (追加あり) ---
const songs = [
    { title: '晴れやかな朝', artist: 'BGM作家1', filePath: '/TennaiBGM/musics/sample.mp3' },
    { title: '午後のカフェテラス', artist: 'BGM作家2', filePath: '/TennaiBGM/musics/sample2.mp3' },
    { title: '星降る夜に', artist: 'BGM作家3', filePath: '/TennaiBGM/musics/sample3.mp3' }
];

let songIndex = 0;
const audio = new Audio();
let isPlaying = false;
let isShuffle = false;  // [New!] シャッフル状態を管理
let repeatMode = 0;     // [New!] リピート状態を管理 (0:OFF, 1:全曲リピート, 2:1曲リピート)


// --- 3. 機能ごとの関数を定義 (変更・追加あり) ---

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

// [Modified!] シャッフル機能を追加した nextSong 関数
function nextSong() {
    if (isShuffle) {
        let randomIndex;
        // 現在の曲と違う曲になるまでランダムなインデックスを生成
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

// (時間整形、プログレスバー更新、シーク機能の関数は変更なし)
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


// --- 4. イベントリスナーの設定 (追加・変更あり) ---

playPauseBtn.addEventListener('click', () => { isPlaying ? pauseSong() : playSong(); });
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

// [New!] シャッフルボタンのクリックイベント
shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle; // true/false を切り替える
    shuffleBtn.classList.toggle('active', isShuffle); // activeクラスを付けたり外したりする
});

// [New!] リピートボタンのクリックイベント
repeatBtn.addEventListener('click', () => {
    repeatMode = (repeatMode + 1) % 3; // 0, 1, 2, 0, 1, ... と切り替える
    
    // アイコンの表示を切り替える
    const repeatIcon = repeatBtn.querySelector('i');
    switch (repeatMode) {
        case 0: // OFF
            repeatBtn.classList.remove('active');
            repeatIcon.classList.remove('fa-repeat-1'); // FontAwesome 5 の1曲リピート用クラス
            repeatIcon.classList.add('fa-redo-alt');
            break;
        case 1: // 全曲リピート
            repeatBtn.classList.add('active');
            repeatIcon.classList.remove('fa-repeat-1');
            repeatIcon.classList.add('fa-redo-alt');
            break;
        case 2: // 1曲リピート
            repeatBtn.classList.add('active');
            repeatIcon.classList.remove('fa-redo-alt');
            repeatIcon.classList.add('fa-repeat-1'); // FontAwesome 5では fas fa-repeat でいけるかも。バージョン次第。今回はfa-redo-altを流用
            break;
    }
});

audio.addEventListener('timeupdate', updateProgressBar);
audio.addEventListener('loadedmetadata', () => { durationEl.textContent = formatTime(audio.duration); });

// [Modified!] 曲が終わったときのイベントをリピートモードに対応させる
audio.addEventListener('ended', () => {
    if (repeatMode === 2) { // 1曲リピートの場合
        playSong();
    } else if (repeatMode === 1) { // 全曲リピートの場合
        nextSong();
    } else { // リピートOFFの場合
        // 最後の曲でなければ次の曲へ、最後の曲なら停止
        if (songIndex === songs.length - 1) {
            pauseSong();
        } else {
            nextSong();
        }
    }
});

progressContainer.addEventListener('click', setProgressBar);

// --- 5. 初期化処理 ---
loadSong();

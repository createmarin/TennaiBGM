// --- 1. HTML要素の取得 ---
// これから操作する画面上の部品（要素）を、プログラムで扱えるように変数に入れます。
const playPauseBtn = document.getElementById('play-pause-btn');
const trackTitle = document.getElementById('track-title');
const trackArtist = document.getElementById('track-artist');

// --- 2. 音楽データとプレイヤーの状態管理 ---
// 再生する音楽の情報をオブジェクトとして用意します。
const song = {
    title: '晴れやかな朝',
    artist: 'フリーBGM作家さん',
    filePath: 'musics/sample.mp3' // ステップ1で用意したファイルへのパス
};

// HTML5のAudio APIを使って、音楽を再生するためのオブジェクトを作成します。
const audio = new Audio();

// 現在、音楽が再生中かどうかを保存しておくための変数（旗印のようなもの）
let isPlaying = false;

// --- 3. 機能ごとの関数を定義 ---

/**
 * 曲をプレイヤーに読み込む関数
 * @param {object} songData - 再生したい曲の情報オブジェクト
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
    // 再生ボタンのアイコンを「一時停止マーク」に変更します。
    playPauseBtn.querySelector('i').classList.remove('fa-play');
    playPauseBtn.querySelector('i').classList.add('fa-pause');
    audio.play();
}

/**
 * 曲を一時停止する関数
 */
function pauseSong() {
    isPlaying = false;
    // 一時停止ボタンのアイコンを「再生マーク」に戻します。
    playPauseBtn.querySelector('i').classList.remove('fa-pause');
    playPauseBtn.querySelector('i').classList.add('fa-play');
    audio.pause();
}

// --- 4. イベントリスナーの設定 ---
// 「いつ（イベント）、何を（関数）するか」を設定します。

// 再生・一時停止ボタンがクリックされたら…
playPauseBtn.addEventListener('click', () => {
    // もし現在再生中(isPlayingがtrue)なら、pauseSong関数を実行
    // そうでなければ、playSong関数を実行
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});


// --- 5. 初期化処理 ---
// ページが読み込まれたときに、最初に実行される処理です。
// 用意した曲情報をプレイヤーに読み込んでおきます。
loadSong(song);
let allLyrics = [];
let current = 0;
let score = 0;
let trackData = {};

const NUM_TAYLOR = 200;
const NUM_AI = 200;

Promise.all([
  fetch('data/lyrics_taylor_only.json').then(res => res.json()),
  fetch('data/lyrics_ai_only.json').then(res => res.json()),
  fetch('data/track_data.json').then(res => res.json())
]).then(([taylorLyrics, aiLyrics, trackInfo]) => {
  trackData = trackInfo;

  const taylorSample = getRandomSample(taylorLyrics, NUM_TAYLOR);
  const aiSample = getRandomSample(aiLyrics, NUM_AI);

  allLyrics = interleaveArrays(taylorSample, aiSample);
  showLyric();
});

function showLyric() {
  if (current < allLyrics.length) {
    const lyric = allLyrics[current];
    document.getElementById('lyric').innerText = `"${lyric.text}"`;
    document.getElementById('result').innerText = '';
    document.getElementById('nextBtn').style.display = 'none';
    setGuessButtonsDisabled(false);
  } else {
    document.getElementById('lyric').innerText = "🎉 Game Over!";
    document.querySelector(".buttons").style.display = "none";
    document.getElementById('nextBtn').style.display = "none";
    document.getElementById('result').innerText = `Final Score: ${score}/${allLyrics.length}`;
  }
}

function guess(choice) {
  const currentLyric = allLyrics[current];
  const correct = currentLyric.type;
  const resultElem = document.getElementById('result');

  if (choice === correct) {
    score++;
    resultElem.innerText = "✅ Correct!";
  } else {
    resultElem.innerText = `❌ Nope! That was ${correct.toUpperCase()}`;
  }

  if (currentLyric.type === "taylor") {
    const albumCode = currentLyric.album;
    const trackNum = currentLyric.track;
    const albumInfo = trackData[albumCode];

    if (albumInfo) {
      const albumName = albumInfo.album;
      const year = albumInfo.year;
      const trackName = albumInfo.tracks[trackNum] || "(Unknown Title)";

      resultElem.innerText += `\nAlbum: ${albumName} (${year})\nTrack ${trackNum}: ${trackName}`;
    }
  }

  document.getElementById('score').innerText = `Score: ${score}`;
  document.getElementById('nextBtn').style.display = 'inline-block';
  setGuessButtonsDisabled(true);
  current++;
}

function setGuessButtonsDisabled(disabled) {
  const buttons = document.querySelectorAll(".buttons button");
  buttons.forEach(btn => btn.disabled = disabled);
}

function getRandomSample(arr, n) {
  return arr.sort(() => Math.random() - 0.5).slice(0, n);
}

function interleaveArrays(taylors, ais) {
  const interleaved = [];
  const maxLen = Math.max(taylors.length, ais.length);
  const startWithTaylor = Math.random() < 0.5;

  for (let i = 0; i < maxLen; i++) {
    if (startWithTaylor) {
      if (i < taylors.length) interleaved.push(taylors[i]);
      if (i < ais.length) interleaved.push(ais[i]);
    } else {
      if (i < ais.length) interleaved.push(ais[i]);
      if (i < taylors.length) interleaved.push(taylors[i]);
    }
  }

  return shuffleSoft(interleaved, 4, 6);
}


function shuffleSoft(arr, minBlockSize, maxBlockSize) {
  const result = [];
  let i = 0;

  while (i < arr.length) {
    const blockSize = Math.floor(Math.random() * (maxBlockSize - minBlockSize + 1)) + minBlockSize;
    const block = arr.slice(i, i + blockSize).sort(() => Math.random() - 0.5);
    result.push(...block);
    i += blockSize;
  }

  return result;
}

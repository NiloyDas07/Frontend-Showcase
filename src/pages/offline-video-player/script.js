const body = document.querySelector(".app-body");
const themeToggle = document.querySelector(".theme-toggle");
const selectVideo = document.querySelector(".select-video");
const videoElement = document.querySelector("video");
const playButton = document.querySelector(".custom-play-button");
const videoTrack = videoElement.querySelector("track");

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js");
}

// Hidden file input
const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.accept = "video/*";
fileInput.style.display = "none";
document.body.appendChild(fileInput);

selectVideo.addEventListener("click", () => {
  fileInput.click();
});

// When the user selects a file, load it into the <video>
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;

  // Revoke any old object URL to avoid memory leaks
  if (videoElement.src && videoElement.src.startsWith("blob:"))
    URL.revokeObjectURL(videoElement.src);

  const videoUrl = URL.createObjectURL(file);
  videoElement.src = videoUrl;
  videoElement.load();
});

themeToggle.addEventListener("click", () => {
  body.classList.toggle("light");
  body.classList.toggle("dark");
});

// Play Button
// Show button initially if video is paused
videoElement.addEventListener("loadeddata", () => {
  if (videoElement.paused) playButton.style.display = "block";
});

// Toggle play/pause on button click
playButton.addEventListener("click", () => {
  videoElement.play();
});

// Hide button when video plays
videoElement.addEventListener("play", () => {
  playButton.style.display = "none";
});

// Show button again when video pauses
videoElement.addEventListener("pause", () => {
  playButton.style.display = "block";
});

// Hidden subtitle file input
const subtitleInput = document.createElement("input");
subtitleInput.type = "file";
subtitleInput.accept = ".vtt, .srt, .ssa, .ass, .sub";
subtitleInput.style.display = "none";
document.body.appendChild(subtitleInput);

// Wire up the "Add Subtitles" button
const addSubtitlesBtn = document.querySelector(".add-subtitles");
addSubtitlesBtn.addEventListener("click", () => {
  subtitleInput.click();
});

// Converting srt(and other) formats to vtt
function srtToVtt(srtText) {
  // Add WebVTT header
  let vttText = "WEBVTT\n\n";
  // Insert a line break after timecode arrows
  vttText += srtText.replace(
    /(\d+:\d+:\d+,\d+)\s-->\s(\d+:\d+:\d+,\d+)/g,
    (_, start, end) => `${start.replace(",", ".")} --> ${end.replace(",", ".")}`
  );
  return vttText;
}

subtitleInput.addEventListener("change", async () => {
  const file = subtitleInput.files[0];
  if (!file) return;

  // Read file contents
  const text = await file.text();
  const isVtt = /\.vtt$/i.test(file.name);
  const vttContent = isVtt ? text : srtToVtt(text);

  // Create a Blob and Object URL
  const blob = new Blob([vttContent], { type: "text/vtt" });
  const trackUrl = URL.createObjectURL(blob);

  // Configure the <track> element
  videoTrack.kind = "subtitles";
  videoTrack.label = file.name.replace(/\.[^/.]+$/, ""); // e.g. “movie-en”
  videoTrack.srclang = file.name.split(".").slice(-2, -1)[0]; // naive lang from filename
  videoTrack.src = trackUrl;
  videoTrack.default = true;

  // Show the track
  videoElement.textTracks[0].mode = "showing";
});

let audio = new Audio("./assets/audio/1.mp3");
const play_button = document.querySelector(".btn.play");
const time_left = document.querySelector(".time-left");
const author_name = document.querySelector(".author");
const music_name = document.querySelector(".name-music");
const picture = document.querySelector(".picture");
const audio_road = document.querySelector(".audio-road");
let num, array, width, context, logo, myElements, analyser, src, height;
const theme_elem2 = document.querySelector(".theme_elem2");
const theme_elem1 = document.querySelector(".theme_elem1");
const theme_elem3 = document.querySelector(".theme_elem3");
const progressLine = document.querySelector(".progress");
const timeLine = document.querySelector(".timeline");
const currentTime = document.querySelector(".current-time");
const volume_slider = document.querySelector(".volume_slider");
const progress_slider = document.querySelector(".progress_slider");
const volume_road = document.querySelector(".volume_road");
const time_container = document.querySelector(".time-container");
let intervalId = 0;
num = 16;
array = new Uint8Array(num * 2);
width = 15;

//показ длительности песни при её загрузке

let musicInfo = {
  1: {
    author_name: "Beyonce",
    music_name: "Don't Heart Yourself",
    actual: true,
  },
  2: {
    author_name: "Dua Lipa",
    music_name: "Don't Start Now",
    actual: false,
  },
};
function button_toggle_classes() {
  play_button.classList.toggle("play");
  play_button.classList.toggle("pause");
}
function picture_toggle_classes() {
  picture.classList.toggle("picture-theme1");
  picture.classList.toggle("picture-theme2");
}
//кнопка включения музыки
function add_handlers(audio) {
  audio.addEventListener("play", function () {
    handle_audio_road();
    button_toggle_classes();
  });
  audio.addEventListener("pause", function () {
    let time = 10;
    for (let elem of document.querySelectorAll(".logo")) {
      setTimeout(() => {
        elem.remove();
      }, time);
      time += 10;
    }
    button_toggle_classes();
    clearInterval(intervalId);
  });
  audio.addEventListener("loadeddata", function () {
    time_left.textContent = getTimeFromNum(audio.duration);
    timeLine.width = getTimeFromNum(audio) + "px";
  });
  audio.addEventListener("playing", function () {
    intervalId = setInterval(() => {
      const num = audio.currentTime / audio.duration;
      progressLine.style.width = num * time_line_width + "px";
      progress_slider.style.left = num * time_line_width + "px";
      currentTime.textContent = getTimeFromNum(audio.currentTime);
    }, 500);
  });
}
add_handlers(audio);
play_button.addEventListener("click", function (event) {
  if (play_button.classList.contains("play")) {
    audio.play();
  } else if (play_button.classList.contains("pause")) {
    audio.pause();
  }
});
//обработчик времени
function parseIntToTwoDigit(num) {
  if (num < 10) {
    return "0" + num;
  }
  return String(num);
}
function getTimeFromNum(num) {
  let seconds = parseInt(num);
  let minutes = parseInt(seconds / 60);
  seconds -= minutes * 60;
  let hours = 0;
  if (minutes >= 60) {
    hours = Math.floor(minutes / 60);
    minutes -= 60 * hours;
  }
  if (hours == 0) {
    return `${parseIntToTwoDigit(minutes)}:${parseIntToTwoDigit(seconds % 60)}`;
  }
  return `${parseIntToTwoDigit(hours)}:${parseIntToTwoDigit(
    minutes
  )}:${parseIntToTwoDigit(seconds % 60)}`;
}
//включение следующей песни
const btn_next = document.querySelector(".btn.next");
const btn_prev = document.querySelector(".btn.prev");

for (let button of [btn_next, btn_prev]) {
  button.addEventListener("click", function () {
    for (let elem of document.querySelectorAll(".logo")) {
      elem.remove();
    }
    let newMusic;
    for (newMusic in musicInfo) {
      if (musicInfo[newMusic].actual) {
        musicInfo[newMusic].actual = false;
      } else {
        musicInfo[newMusic].actual = true;
        break;
      }
    }
    audio.pause();
    audio = new Audio(`./assets/audio/${newMusic}.mp3`);
    context = undefined;
    add_handlers(audio);
    audio.addEventListener("loadeddata", function () {
      time_left.textContent = getTimeFromNum(audio.duration);
      timeLine.width = getTimeFromNum(audio) + "px";
    });
    setTimeout(() => {
      author_name.textContent = musicInfo[newMusic].author_name;
      music_name.textContent = musicInfo[newMusic].music_name;
      audio.play();
    }, 500);

    picture_toggle_classes();
  });
}
function handle_audio_road() {
  if (!context) preparation();
  for (let i = 0; i < num; i++) {
    logo = document.createElement("div");
    logo.className = "logo";
    logo.style.minWidth = width + "px";
    audio_road.appendChild(logo);
  }
  myElements = document.getElementsByClassName("logo");
  loop();
}
function preparation() {
  context = new AudioContext();
  analyser = context.createAnalyser();
  src = context.createMediaElementSource(audio);
  src.connect(analyser);
  analyser.connect(context.destination);
}
function loop() {
  if (!audio.paused) {
    window.requestAnimationFrame(loop);
    analyser.getByteFrequencyData(array);
    for (let i = 0; i < num; i++) {
      height = array[i + num];
      myElements[i].style.height = height * 0.65 + "px";
      myElements[i].style.opacity = height * 0.0065;
    }
  }
}
theme_elem2.addEventListener("click", function () {
  document.documentElement.style.setProperty(
    "--background-color",
    "rgba(3, 238, 54, 0.514)"
  );
  document.documentElement.style.setProperty("--text-color", "#000");
});
theme_elem1.addEventListener("click", function () {
  document.documentElement.style.setProperty("--background-color", "#808080");
  document.documentElement.style.setProperty(
    "--text-color",
    "rgb(10, 191, 194)"
  );
});
theme_elem3.addEventListener("click", function () {
  document.documentElement.style.setProperty(
    "--background-color",
    "rgb(212, 149, 11)"
  );
  document.documentElement.style.setProperty(
    "--text-color",
    "rgb(167, 142, 1)"
  );
});

volume_slider.addEventListener("mousedown", function (event) {
  let leftEdge = volume_road.getBoundingClientRect().left;
  let rightEdge = volume_road.getBoundingClientRect().right;
  let width = parseInt(window.getComputedStyle(volume_road).width);
  let num = 0;
  function moveAt(pageX) {
    num = pageX - volume_slider.offsetWidth / 2;
    if (num < leftEdge) {
      num = leftEdge;
    } else if (num > rightEdge) {
      num = rightEdge;
    }
    volume_slider.style.left = num - leftEdge + "px";
  }
  moveAt(event.pageX);
  function onMouseMove(event) {
    moveAt(event.pageX);
  }
  document.addEventListener("mousemove", onMouseMove);
  document.onmouseup = function () {
    document.removeEventListener("mousemove", onMouseMove);
    audio.volume = (num - leftEdge) / width;
    document.onmouseup = null;
  };
});
volume_slider.ondragstart = function () {
  return false;
};

let time_line_width = parseInt(
  window.getComputedStyle(document.querySelector(".timeline")).width
);
if (audio.played) {
  setInterval(() => {
    const num = audio.currentTime / audio.duration;
    progressLine.style.width = num * time_line_width + "px";
    progress_slider.style.left = num * time_line_width + "px";
    currentTime.textContent = getTimeFromNum(audio.currentTime);
  }, 500);
}

progress_slider.addEventListener("mousedown", function (event) {
  let leftEdge = timeLine.getBoundingClientRect().left;
  let rightEdge = timeLine.getBoundingClientRect().right;
  let width = parseInt(window.getComputedStyle(timeLine).width);
  let leftTime = 0;
  onMouseMove(event);

  function onMouseMove(event) {
    audio.pause();
    let num = event.pageX;
    if (num < leftEdge) {
      num = leftEdge;
    } else if (num > rightEdge) {
      num = rightEdge;
    }
    progress_slider.style.left = Math.abs(num - leftEdge) + "px";
    progressLine.style.width = Math.abs(num - leftEdge) + "px";
  }
  function putTime(event) {
    leftTime = Math.floor(
      (Math.abs(event.pageX - leftEdge) / width) * audio.duration
    );
    audio.currentTime = leftTime;
    timeLine.onmouseleave = null;
    audio.play();
  }
  document.addEventListener("mousemove", onMouseMove);

  document.onmouseup = function (event) {
    document.removeEventListener("mousemove", onMouseMove);
    putTime(event);
    document.onmouseup = null;
  };
});
progress_slider.ondragstart = function () {
  return false;
};

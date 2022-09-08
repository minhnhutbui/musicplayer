const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'player_storage';

const playList = $(".playlist");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd .cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  playedSong: [],
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
  },
  songs: [
    {
      name: "123567",
      singer: "Ton Yen Tu",
      path: "./asset/music/gapgo.mp3",
      img: "./asset/img/gap go.jpg",
    },
    {
      name: "flash",
      singer: "jay",
      path: "./asset/music/flash.mp3",
      img: "./asset/img/flash.jpg",
    },
    {
      name: "good days",
      singer: "A",
      path: "./asset/music/good-old-days.mp3",
      img: "./asset/img/good old days.jpg",
    },
    {
      name: "happy",
      singer: "B",
      path: "./asset/music/happy.mp3",
      img: "./asset/img/happy.jpg",
    },
    {
      name: "july",
      singer: "C",
      path: "./asset/music/july.mp3",
      img: "./asset/img/july.jpg",
    },
    {
      name: "lonely",
      singer: "A",
      path: "./asset/music/lonely.mp3",
      img: "./asset/img/lonely.jpg",
    },
    {
      name: "paradise",
      singer: "A",
      path: "./asset/music/paradise.mp3",
      img: "./asset/img/paradise.jpg",
    },
    {
      name: "remember our summer",
      singer: "A",
      path: "./asset/music/remember-our-summer.mp3",
      img: "./asset/img/remember our summer.jpg",
    },
    {
      name: "deep end",
      singer: "A",
      path: "./asset/music/deep-end.mp3",
      img: "./asset/img/deep end.jpg",
    },
    {
      name: "Fire Stone",
      singer: "A",
      path: "./asset/music/firestone.mp3",
      img: "./asset/img/fire stone.jpg",
    },
  ],
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index ="${index}">
                <div class="thumb"
                    style="background-image: url('${song.img}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>`;
    });
    playList.innerHTML = htmls.join("");
  },
  handleEvents: function () {
    const _this = this;
    // CD rotate
    const cdAnimation = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iterations: Infinity,
    });
    cdAnimation.pause();

    // zoom CD
    const cdWidth = cd.offsetWidth;
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const cdNewWidth = cdWidth - scrollTop;

      cd.style.width = cdNewWidth > 0 ? cdNewWidth + "px" : 0;
      cd.style.opacity = cdNewWidth / cdWidth;
    };
    // Click on play button to play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // click on next button
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.ScrollToActiveSong();

    };
    // click on prev button
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.ScrollToActiveSong();
    };
    // click on random button
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      _this.setConfig('isRandom', _this.isRandom);
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    // click on repeat button
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig('isRepeat', _this.isRepeat);
      repeatBtn.classList.toggle("active", _this.isRepeat);
      audio.loop = true;
    };
    // active song 
    // when song is playing
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdAnimation.play();
    };
    // when song is paused
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdAnimation.pause();
    };
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progress.value = progressPercent;
      }
    };
    // Play next song when current song is ended
    audio.onended = function () {
      nextBtn.click();
    };
    // Rewind
    progress.oninput = function (e) {
      const seekTime = (e.target.value * audio.duration) / 100;
      audio.currentTime = seekTime;
    };
    // click to play 
    playList.onclick = function (e) {
      const songElement = e.target.closest('.song:not(.active)');
      if (songElement || e.target.closest('.option')) {
        if (songElement) {
          _this.currentIndex = Number(songElement.dataset.index); //songElement.getAttribute('data-index')
          _this.loadCurrentSong();
          _this.render()
          audio.play();
        }
      }
    }
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  ScrollToActiveSong: function () {
    setTimeout(() => {
      $('.song.active').scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }, 300)
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`;
    audio.src = this.currentSong.path;
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  randomSong: function () {
    let newIndex;
    let i = 0;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    if (!this.playedSong.includes(newIndex)) {
      this.playedSong.push(newIndex);
      this.currentIndex = newIndex;
      if (this.playedSong.length >= this.songs.length) {
        this.playedSong.splice(0, this.playedSong.length);
        this.playedSong.push(newIndex);
      }
      this.loadCurrentSong();
    }
  },
  start: function () {
    //config
    this.loadConfig();
    //define properties for app
    this.defineProperties();

    //handle events
    this.handleEvents();

    //Load current song
    this.loadCurrentSong();

    //render Songs
    this.render();
    randomBtn.classList.toggle("active", this.isRandom);

    repeatBtn.classList.toggle("active", this.isRepeat);
  },
};
app.start();






let audio = document.querySelector(".quranplayer"),
  surahsContainer = document.querySelector(".surahs"),
  ayah = document.querySelector(".ayah"),
  next = document.querySelector(".next"),
  play = document.querySelector(".play"),
  prev = document.querySelector(".prev");
getSurahs();

function getSurahs() {
  fetch("https://api.alquran.cloud/v1/surah")
    .then((response) => response.json())
    .then((data) => {
      console.log(data.data);
      for (let surah in data.data) {
        surahsContainer.innerHTML += `<div>
        <p>${data.data[surah].name}</p>
        <p>${data.data[surah].englishName}</p>
        </div>
        `;
      }
      let allSurahs = document.querySelectorAll(".surahs div"),
        ayahsAudios,
        ayahsText;
      allSurahs.forEach((surah, index) => {
        surah.addEventListener("click", () => {
          fetch(`http://api.alquran.cloud/v1/surah/${index + 1}/ar.alafasy`)
            .then((response) => response.json())
            .then((data) => {
              let ayat = data.data.ayahs;
              ayahsAudios = [];
              ayahsText = [];
              ayat.forEach((verse) => {
                ayahsAudios.push(verse.audio);
                ayahsText.push(verse.text);
              });
              let AyahIndex = 0;
              changeAyah(AyahIndex);
              audio.addEventListener("ended", () => {
                AyahIndex++;
                if (AyahIndex < ayahsAudios.length) {
                  changeAyah(AyahIndex);
                } else {
                  AyahIndex = 0;
                  changeAyah(AyahIndex);
                  audio.pause();
                  Swal.fire({
                    title: "انتهت التلاوة",
                    text: "مع تحيات د/ محمد عماد",
                    imageUrl:
                      "https://lh3.googleusercontent.com/a/ACg8ocL9DJ2B4zhmHhrNyF-01MfLt1hbtVQAdA5rdzADmo1XEPTXj1d6GryqqkGOG89tVK7nvcKx0NC9SMermhtoAItRwCONzVo=s288-c-no",
                    imageWidth: 200,
                    imageHeight: 200,
                    imageAlt: "Custom image",
                  });
                  isPlaying=true;
                  togglePlay()
                }
              });

              next.addEventListener("click", () => {
                AyahIndex < ayahsAudios.length - 1
                  ? AyahIndex++
                  : (AyahIndex = 0);
                changeAyah(AyahIndex);
              });
              prev.addEventListener("click", () => {
                AyahIndex == 0
                  ? (AyahIndex = ayahsAudios.length - 1)
                  : AyahIndex--;
                changeAyah(AyahIndex);
              });
              let isPlaying=false;
              togglePlay()
              function togglePlay(){
                if(isPlaying){
                  audio.pause();
                  play.innerHTML=`<i class="fas fa-play"></i>`;
                  isPlaying=false;
                }
                else{
                  audio.play();
                  play.innerHTML=`<i class="fas fa-pause"></i>`;
                  isPlaying=true;
                }
              }
              play.addEventListener("click",togglePlay)
              function changeAyah(index) {
                audio.src = ayahsAudios[index];
                ayah.innerHTML = ayahsText[index];
              }
            });
        });
      });
    });
}

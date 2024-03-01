currentsong = new Audio();
let songs;
let currfolder;


function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00"
    }
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60);

    // Add leading zeros if necessary
    var formattedMinutes = (minutes < 10 ? '0' : '') + minutes;
    var formattedSeconds = (remainingSeconds < 10 ? '0' : '') + remainingSeconds;

    return formattedMinutes + ':' + formattedSeconds;
}




async function inputSongs(folder) {
    currfolder = folder
    let a = await fetch(`/${currfolder}/`)

    let text = await a.text()
    // console.log(text)
    let doc = document.createElement("div")
    doc.innerHTML = text
    let as = doc.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${currfolder}/`)[1]);
        }


    }

    let song_list = document.querySelector(".yoursongs")
    song_list.innerHTML = ""
    for (const i of songs) {
        song_list.innerHTML = song_list.innerHTML + `<div class="song-bar flex">
        <div class="music-name flex ">
            <img src="/svg/music.svg" alt="">
            <div>
                ${i.replace(/%20/g, " ")}
            </div>
        </div> 
        <img class="play1" src="play.svg" alt="">

    </div>`

    }

    // audio.play();
    Array.from(document.querySelector(".yoursongs").getElementsByClassName("song-bar")).forEach(e => {
        e.addEventListener("click", element => {
            playmusic(e.querySelector(".music-name").lastElementChild.innerHTML.trim())
        })
        // console.log(e.querySelector(".music-name").lastElementChild.innerHTML.trim())
    })
    // console.log(songs)
    return songs

}




const playmusic = (track, pause = false) => {
    // let audio = new Audio(`/songs/${track}`)
    currentsong.src = `/${currfolder}/` + track
    if (!pause) {
        currentsong.play();
        play.src = "pause.svg";
    }


    document.querySelector(".track-name").innerHTML = track;
    document.querySelector(".duration").innerHTML = "00:00 / 00:00"
}
async function displayAlbum() {
    let a = await fetch(`/songs/`)

    let text = await a.text()
    // console.log(text)
    let doc = document.createElement("div")
    doc.innerHTML = text;
    let anchor = doc.getElementsByTagName("a");
    let cards = document.querySelector(".cards");
    let arry = Array.from(anchor)
    for (let index = 0; index < arry.length; index++) {
        const i = arry[index];
        if (i.href.includes("/songs") && !i.href.includes(".htaccess")) {
            // console.log();
            let folder = i.href.split("/").slice(-2)[0];
            let a = await fetch(`/songs/${folder}/info.json`)

            let text = await a.json();
            console.log(text);
            cards.innerHTML = cards.innerHTML + `
            <div data-folder="${folder}" class="card">
                    <div class="play translate">
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                            fill="#00FF00" height="50px" width="50px" version="1.1" id="Layer_1" viewBox="0 0 40 40"
                            xml:space="preserve">
                            <circle cx="20" cy="20" r="20" fill="#000000" />
                            <path xmlns="http://www.w3.org/2000/svg" id="XMLID_113_"
                                d="M19.994,0C8.952,0,0,8.952,0,19.994c0,11.043,8.952,19.995,19.994,19.995  c11.043,0,19.995-8.952,19.995-19.995C39.989,8.952,31.037,0,19.994,0z M26.682,21.386l-11.769,6.795  c-1.071,0.619-2.41-0.155-2.41-1.392V13.2c0-1.237,1.339-2.01,2.41-1.392l11.769,6.795C27.754,19.221,27.754,20.768,26.682,21.386z" />
                        </svg>
                    </div>
                    <img src="/songs/${folder}/cover.jpeg" alt="">
                    <h3>
                        ${text.title}
                    </h3>
                    <p>
                        ${text.description}
                    </p>
                </div>`

        }

    }
}


async function main() {
    songs = await inputSongs("songs/MukundsFav"); // Move this line above playmusic
    playmusic(songs[0], true);
    // console.log(songs);
    await displayAlbum()

    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "pause.svg"

        }
        else {
            currentsong.pause()
            play.src = "play.svg"
        }
    })

    currentsong.addEventListener("timeupdate", () => {
        // console.log(currentsong.currentTime, currentsong.duration);
        let time = formatTime(currentsong.currentTime);
        let totaltime = formatTime(currentsong.duration)
        document.querySelector(".duration").innerHTML = `${time} / ${totaltime}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%"

        document.querySelector(".seekbar").addEventListener("click", e => {
            let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;

            document.querySelector(".circle").style.left = percent + "%"
            currentsong.currentTime = ((currentsong.duration) * percent) / 100

        })
    })


    currentsong.addEventListener("ended", () => {
        // Add the following code to loop the same song
        if (currentsong.loop = true) {
            // If the loop property is set, replay the same song
            currentsong.currentTime = 0;
            currentsong.play();
        } else {
            // If the loop property is not set, move to the next song
            let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
            if (index < songs.length - 1) {
                playmusic(songs[index + 1]);
            }
        }
    });


    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0%"
    })


    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%"
    })


    previous.addEventListener("click", () => {
        // console.log(document.querySelector(".music-name").lastElementChild.innerHTML)
        // 
        // console.log(currentsong.src.split("/").slice(-1)[0])
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
        // console.log(index);
        if (index > 0) {
            playmusic(songs[index - 1]);
        }
    })
    next.addEventListener("click", () => {
        // console.log(document.querySelector(".music-name").lastElementChild.innerHTML)
        // 
        // console.log(currentsong.src.split("/").slice(-1)[0])
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
        // console.log(index);
        if (index < songs.length - 1) {
            playmusic(songs[index + 1]);
        }

    })
    document.querySelector(".vol").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log(e, e.target, e.target.value)
        currentsong.volume = parseInt(e.target.value) / 100
    })
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        // console.log(e);
        e.addEventListener("click", async item => {

            songs = await inputSongs(`songs/${item.currentTarget.dataset.folder}`)
        })

    });


}

main()
// Array.from(document.getElementsByClassName("card")).forEach( e => {
//     console.log(e);})


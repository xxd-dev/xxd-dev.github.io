var global_api_key = "";

function main() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("api")) {
        const api_key = urlParams.get("api");
        global_api_key = api_key;
    }
    if (!urlParams.has("subs")) {
        let e = document.getElementById("progress-bar");
        e.parentNode.removeChild(e);
        return;
    }
    const channel_concat = urlParams.get("subs");
    const channels = channel_concat.split(",");

    var channel_dict = {};
    var videos_list = [];
    var video_dict = {};
    var num_channels = channels.length;
    document.getElementById("progress-bar").max = num_channels + 2;
    document.getElementById("progress-bar").value = 0;
    
    playlists_promises = [];
    for (let i in channels) {
        playlist = "UU" + channels[i].substring(2);
        playlists_promises.push(
            fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2Cstatus%2CcontentDetails&maxResults=50&playlistId=${playlist}&key=${global_api_key}`)
            .then(response => {
                document.getElementById("progress-bar").value += 1;
                return response.json();
            })
        );
    }

    Promise.all(playlists_promises)
    .then((values) => {
        let playlists = values;
        let raw_videos = [];
        for (let i in playlists) {
            let playlist = playlists[i];
            raw_videos = raw_videos.concat(playlist.items);
        }
        videos_list = raw_videos.map(function(item) {
            return {
                videoId: item.snippet.resourceId.videoId,
                thumbnail: item.snippet.thumbnails.high.url,
                title: item.snippet.title,
                channelId: item.snippet.channelId,
                channelTitle: item.snippet.channelTitle,
                upload_date: formatDate(item.snippet.publishedAt),
                upload_date_millis: new Date(item.snippet.publishedAt).getTime()
            };
        });
        videos_list.sort(function (first, second) {
            return second.upload_date_millis- first.upload_date_millis;
        });
        videos_list = videos_list.slice(0, 50);
        
        videoIds = videos_list.map(item => item.videoId);
        document.getElementById("progress-bar").value += 1;
        return fetch(`https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${channel_concat}&key=${global_api_key}`);
    })
    .then(response => response.json())
    .then(response => {
        let channels = response.items
        for (let i in channels) {
            channel_dict[channels[i].id] = channels[i];
        }

        let video_concat = videoIds.join(",");
        document.getElementById("progress-bar").value += 1;
        return fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${video_concat}&key=${global_api_key}`);
    })
    .then(response => response.json())
    .then(response => {
        let videos = response.items;
        for (let i in videos) {
            video_dict[videos[i].id] = videos[i];
        }

        console.log(video_dict);
        console.log(channel_dict);
        let e = document.getElementById("progress-bar");
        e.parentNode.removeChild(e);

        for (let i in videos_list) {
            video = videos_list[i];
            console.log(video);
            let html = `
            <div class="card">
                <a href="watch/?api=${global_api_key}&v=${video.videoId}" target="_blank" rel="noopener">
                    <span style="display: block;">
                        <div class="thumbnail-stack">
                            <img src="${video.thumbnail}" class="card__img" alt="thumbnail">
                            <p class="video-length">${toTime(video_dict[video.videoId].contentDetails.duration)}</p>
                        </div>
                        <div class="channel-info">
                            <img class="avatar" src="${channel_dict[video.channelId].snippet.thumbnails.default.url}" alt="avatar">
                            <div class="marked">
                                <h3 class="channel-name crop">${video.title}</h3>
                                <p class="subs">${video.channelTitle}</p>
                                <p class="subs2">${formatNumber(video_dict[video.videoId].statistics.viewCount)} views - ${formatDate(video_dict[video.videoId].snippet.publishedAt)}</p>
                            </div>
                        </div>
                    </span>
                </a>
            </div>
            `;
            document.getElementById("grid").innerHTML += html;
        }
    })

}

String.prototype.replaceAt = function(index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

function tmp() {
    console.log("nice");
}
  
function escapeHTML(str){
    var p = document.createElement("p");
    p.appendChild(document.createTextNode(str));
    return p.innerHTML.replaceAll("\n", "<br>");
}


  
function formatNumber(m) {
    return nFormatter(Number(m), 1);
}

function nFormatter(num, digits) {
    const lookup = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "k" },
      { value: 1e6, symbol: "M" },
      { value: 1e9, symbol: "G" },
      { value: 1e12, symbol: "T" },
      { value: 1e15, symbol: "P" },
      { value: 1e18, symbol: "E" }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup.slice().reverse().find(function(item) {
      return num >= item.value;
    });
    return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
  }

  function formatDate(dateString) {
	const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	date = dateString.split("T")[0].split('-').reverse();
  date[1] = months[Number(date[1])-1];
  return date.join(' ');
}

function keydownSearch(event) {
    if (event.keyCode == 13) {
        search();
    }
}

function search() {
    var search = encodeURIComponent(document.getElementById("search-field").value).replaceAll("%20", "+");
    window.open(`search/?api=${global_api_key}&search=${search}`, "_blank");
    document.getElementById("search-field").value = "";
}

function toTime(isotime) {
	let arr = [...isotime.matchAll("[0-9]+")];
  let ret = arr.shift();
  while (arr.length) {
  	ret += ":" + arr.shift()[0].padStart(2, '0');
  }
  return ret;
}
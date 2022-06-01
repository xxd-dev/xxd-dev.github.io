var global_api_key = "";

function main() {
    const urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.has("api")) {
        window.open('../howto','_self');
        return;
    }

    const api_key = urlParams.get("api");
    global_api_key = api_key;

    if (!urlParams.has("search")) {
        return;
    }
    
    const search_query = urlParams.get("search");
    var videoIDs = new Set();
    var channelIDs = new Set();
    var search;
    var video_dict = {};
    var channel_dict = {};
    //return;
    //fetch("../query.json") //TODO fetch actual search
    let maxResults = 25;
    fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxResults}&q=${search_query}&key=${api_key}`)
    .then(response => response.json())
    .then(response => {
        search = response;
        for (let i in response.items) {
            result = response.items[i];
            if (result.id.kind === "youtube#video") {
                videoIDs.add(result.id.videoId);
            }
            channelIDs.add(result.snippet.channelId);
        }
        video_concat = Array.from(videoIDs).join(",");
        console.log(video_concat);
        return fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${video_concat}&key=${api_key}`);
    })
    .then(response => response.json())
    .then(response => {
        let videos = response.items;
        for (let i in videos) {
            video_dict[videos[i].id] = videos[i];
        }

        channel_concat = Array.from(channelIDs).join(",");
        return fetch(`https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${channel_concat}&key=${api_key}`);
    })
    .then(response => response.json())
    .then(response => {
        let channels = response.items
        for (let i in channels) {
            channel_dict[channels[i].id] = channels[i];
        }

        for (let i in search.items) {
            video = search.items[i];
            if (!(video.id.kind === "youtube#video")) {
                continue;
            }
            let video_url = `../watch/?api=${global_api_key}&v=${video.id.videoId}`;
            let channel_url = `../`;
            let a = '';
            let sub_count = "";
            if (!channel_dict[video.snippet.channelId].statistics.hiddenSubscriberCount) {
                sub_count = formatNumber(channel_dict[video.snippet.channelId].statistics.subscriberCount) + " subs";
            }
            let html = `
            <div class="search-video-container">
                <div class="search-video-left-container">
                    <a href="${video_url}" target="_blank" rel="noopener">
                        <div class="search-video-thumbnail-container">
                            <div class="search-video-thumbnail-wrapper">
                                <img src="${video.snippet.thumbnails.high.url}" class="search-video-thumbnail">
                            </div>
                            <div class="search-video-length-wrapper">
                                <p class="search-video-length">${toTime(video_dict[video.id.videoId].contentDetails.duration)}</p>
                            </div>
                        </div>
                    </a>
                </div>
                <div class="search-video-right-container">
                    <div class="video-info-container">
                        <a href="${video_url}" target="_blank" rel="noopener">
                            <h3 class="search-video-title">${video.snippet.title}</h3>
                            <p class="search-video-info">${formatNumber(video_dict[video.id.videoId].statistics.viewCount)} views</p>
                        </a>
                        <a href="${channel_url}" target="_blank" rel="noopener">
                            <div class="search-channel-info">
                                <img class="search-video-avatar" src="${channel_dict[video.snippet.channelId].snippet.thumbnails.high.url}" alt="avatar">
                                <div>
                                    <h3>${video.snippet.channelTitle}</h3>
                                    <p>${sub_count}</p>
                                </div>
                            </div>
                        </a>
                        <p class="search-video-description">${escapeHTML(video_dict[video.id.videoId].snippet.description)}</p>
                    </div>
                </div>
            </div>
            `;
            document.getElementById("search-videos-container").innerHTML += html;
        }
        return 0;
    })
    
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
    window.open(`../search/?api=${global_api_key}&search=${search}`, "_blank");
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
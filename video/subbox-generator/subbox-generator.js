function main() {
    const { userAgent } = navigator
    if (userAgent.includes('Firefox/')) {
        document.getElementById("console").innerHTML += " (firefox: ctrl + shift + j (cmd + option + j on mac))";
    } else if (userAgent.includes('Edg/')) {
        document.getElementById("console").innerHTML += " (edge: ctrl + shift + j (cmd + option + j on mac))";
    } else if (userAgent.includes('Chrome/')) {
        document.getElementById("console").innerHTML += " (chrome: ctrl + shift + j (cmd + option + j on mac))";
    } else if (userAgent.includes('Safari/')) {
        document.getElementById("console").innerHTML += " (safari: cmd + option + c )";
    }
}

function return_message(message) {
    document.getElementById("button").disabled = false;
    document.getElementById("progress").style = "opacity: 0;";
    document.getElementById("subbox").style = "opacity: 1;";
    document.getElementById("subbox").innerHTML = message;
    window.scrollTo(0, document.body.scrollHeight);
}

function generate_url() {
    document.getElementById("button").disabled = true;
    document.getElementById("progress").style = "opacity: 1;";
    document.getElementById("subbox").style = "opacity: 0;"
    try {
        generate_url_error_catcher();
    } catch(error) {
        console.log(error);
        return_message("invalid input!");
    }
}

function generate_url_error_catcher() {
    let api_key = document.getElementById("api-key").value;
    let channels = document.getElementById("channels").value.split("\n");
    let channel_ids = [];
    let tmp = []
    for (let i in channels) {
        let channel = channels[i];
        let res = channel.match("youtube\.com\/channel\/(UC[A-Za-z0-9\-\_]{22})");
        if (res) {
            channel_ids.push(res[1]);
        } else {
            res = channel.match("youtube\.com\/user\/(.*)");
            tmp.push(res[1]);
        }
    }
    channels = tmp;

    channel_promises = []
    for (let i in channels) {
        let channel = channels[i];
        channel_promises.push(
            fetch(`https://youtube.googleapis.com/youtube/v3/channels?part=id&forUsername=${encodeURIComponent(channel)}&key=${api_key}`)
            .then(response => response.json())
        );
    }

    Promise.all(channel_promises)
    .then((values) => {
        for (let i in values) {
            channel_ids.push(values[i].items[0].id);
        }
    })
    .then(response => {
        link = `http://xxd-dev.github.io/video/?api=${api_key}&subs=${channel_ids.join(',')}`;
        text = `successful! bookmark <a href="${link}">this link</a> to access your new subbox`;
        return_message(text);
    });
    return;
}

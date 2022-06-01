<body>
<h1>xxd video</h1>
    <p>A minimal version of youtube, without any recommendations
    </p>

<h2>quickstart</h3>
    <p><ul>
    <li>if you're here to replace your sub-box, go to <a href="../subbox-generator/" target="_blank" rel="noopener">this link</a> and follow the instructions.</li>
    <li>if you're here to watch one video ad- and reccomendation-free, get a <a href="https://developers.google.com/youtube/v3/getting-started" target="_blank" rel="noopener">valid api key</a> and see <a href="#watch">watch</a> for reference.</li>
    <li>if you want to self-host this, get the <a href="https://github.com/xxd-dev/xxd-dev.github.io" target="_blank" rel="noopener">sourcecode</a>.</li>
    </ul>
    </p>

<h2>components of the website<h2>
<h3 id="watch">watch</h3>
    <p>usage: <code>https://xxd-dev.github.io/video/watch/?api=[YOUR_API_KEY]&v=[VIDEO_ID]</code><br>
    <code>YOUR_API_KEY</code>: youtube enabled api key (look <a href="https://developers.google.com/youtube/v3/getting-started" target="_blank" rel="noopener">here</a> for help)<br>
    <code>VIDEO_ID</code>: video-id (i.e. https://www.youtube.com/watch?v=<b>dQw4w9WgXcQ</b>)<br>
    quota cost: 3 points<br>
    An interface to view youtube videos. It comes with the usual information and includes the top few comments.
    </p>

<h3>search</h3>
    <p>usage: <code>https://xxd-dev.github.io/video/search/?api=[YOUR_API_KEY]&search=[SEARCH_QUERY]</code><br>
    <code>YOUR_API_KEY</code>: youtube enabled api key (look <a href="https://developers.google.com/youtube/v3/getting-started" target="_blank" rel="noopener">here</a> for help)<br>
    <code>SEARCH_QUERY</code>: the search-query (URI-encoded, except that spaces become a '+')<br>
    quota cost: 102 points<br>
    <b>warning:</b> many searches will use up your daily quota quickly!<br>
    a youtube search, that will only return videos. a search can be triggered from the search bar present on all other pages.
    </p>

<h3>channel (not yet available)</h3>
    <p>Usage: <code>htttps://xxd-dev.github.io/video/channel/?api=[YOUR_API_KEY]&c=[CHANNEL_ID]</code><br>
    <code>YOUR_API_KEY</code>: youtube enabled api key (look <a href="https://developers.google.com/youtube/v3/getting-started" target="_blank" rel="noopener">here</a> for help)<br>
    <code>CHANNEL_ID</code>: id of the youtube channel (i.e. https://www.youtube.com/channel/<b>UCuAXFkgsw1L7xaCfnd5JJOw</b>)<br>
    quota cost: 3 points<br>
    </p>

<h3>subscriptions</h3>
    <p>usage: <code>https://xxd-dev.github.io/video/?api=[YOUR_API_KEY]&subs=[CHANNEL_IDS]</code><br>
    <code>YOUR_API_KEY</code>: youtube enabled api key (look <a href="https://developers.google.com/youtube/v3/getting-started" target="_blank" rel="noopener">here</a> for help)<br>
    <code>CHANNEL_IDS</code>: comma-separated list of up to 50 channel-IDs (use <a href="#subbox-gen">subbox generator</a> for help)<br>
    quota cost: 2 points + 1 point per channel<br>
    <b>warning:</b> many channels/refreshes can use your daily quota quickly!<br>
    similar to a landing page, this shows all recent uploads of your subscribed cannels. it is limited to the top 50 channels and only returns the 50 most recent uploads.
    </p>

<h3 id="subbox-gen">subbox generator</h3>
    <p>usage: <code>https://xxd-dev.github.io/video/subbox-generator</code><br>
    quota cost: 1 point per channel<br>
    allows you to convert a human-readable list of channels into a comma-separated list of channel-ids. this can be used to migrate your subscriptions from youtube to here.</p>
    <p><br><br><br>
    I am in no way responsible for what you do with your api key and it is not my duty to ensure whether this is a permitted use of it or not. you as the holder of the key are exclusively accountable for using it within this website.
    this website does not use cookies by itself, but there is no guarantee that using the embedded youtube player will not make use of cookies.
    this website does not collect or store any personal data.
    the website uses automated API calls with a key provided by you and takes no responsibility that the api-calls are made correctly or are in order with the terms of service. you use this website at your own risk and take legal responsibility.
    this website does not guarantee functionality in case of changing api-calls or changing terms of service.
    this website is statically served and enables users to do nothing more, than they could do on a locally served instance of this page. you are welcome to use this approach, as this webpage is completely open-source.
    any requests are made by the holder of the api-key and not a webserver.
    other than that,<br>
    enjoy an ad free, recommendation free video platform
    </p>
</body>
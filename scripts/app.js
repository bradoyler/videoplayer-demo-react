
var Router = window.ReactRouter
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;

var App = React.createClass({

    getDefaultProps() {
        return {
            mpxVideos: getVideos('mpx'),
            ytVideos: getVideos('youtube'),
            swVideos: getVideos('stringwire')
        };
    },
    render: function () {
        return (
            <div className="playerApp">
                <RouteHandler />
                <Playlist items={this.props.mpxVideos} />
                <Playlist items={this.props.ytVideos} />
                <Playlist items={this.props.swVideos} />
            </div>
        );
    }
});

var Index = React.createClass({

    contextTypes: {
        router: React.PropTypes.func
    },
    render: function () {
        var video = firstVideo();
        this.context.router.transitionTo('video', {videoId: video.videoId, source: video.source})
        return (<span></span>);
    }
});

var Playlist = React.createClass({

    render: function () {
        var playlistItems = this.props.items.map(function (item) {
            return (
                <PlaylistItem item={item} />
            );
        });

        return (
           <div className="playlist-container">
               <div className="pl_title">{this.props.items[0].source} playlist</div>
                <ul className="playlist">
                    {playlistItems}
                </ul>
            </div>
        );
    }
});

var PlaylistItem = React.createClass({

    render: function () {
        var video = this.props.item;
        return (
            <li key={video.videoId}>
                <Link to="video" params={{ videoId: video.videoId, source:video.source }}>
                    <span className="item_thumb">
                        <img className="thumb" src={video.thumbnail} width="80" height="60" />
                    </span>
                    <span className="item_title">
                        {video.title}
                    </span>
                </Link>
            </li>
        );
    }
});

var Player = React.createClass({

    contextTypes: {
        router: React.PropTypes.func
    },
    render: function () {

        var video = findVideo(this.context.router.getCurrentParams().videoId, this.context.router.getCurrentParams().source);
        if(!video)
            video = firstVideo();

        return (
            <div className="player">
                <h2>{video.title}</h2>
                <iframe src={video.embedUrl} width="420" height="300" />
            </div>
        );
    }
});

var routes = (
    <Route handler={App}>
        <DefaultRoute handler={Index}/>
        <Route name="video" path="video/:videoId/:source" handler={Player} ignoreScrollBehavior />
    </Route>
);

var locationTypes = [Router.HashLocation, Router.HistoryLocation, Router.RefreshLocation];

Router.run(routes, locationTypes[0], function (Handler) {
    React.render(<Handler/>, document.getElementById('pdkplayer'));
});

// render w/o router
//React.render(<App />,document.getElementById('content'));

/*****************************************************************************/
// Data Model

function findVideo(videoId, source) {

    var videos = getVideos(source);

    for (var i = 0, l = videos.length; i < l; i ++) {
        if (videos[i].videoId === videoId) {
            return videos[i];
        }
    }
}

function firstVideo(source) {
    var videos = getVideos(source);
    return videos[0];
}

function getVideos(source) {

    var mpxVideos = playerApp.mpxPlaylist.results.map(function (item) {
        return {
            videoId:item.video.mpxId,
            title:item.video.title,
            thumbnail:item.video.thumbnail,
            embedUrl: item.video.embedUrl,
            source:'mpx'
        };
    });

    var ytVideos = playerApp.ytPlaylist.videos.map(function (item) {
        return {
            videoId:item.videoId,
            title:item.title,
            thumbnail:item.thumbnails.default.url,
            embedUrl: 'https://www.youtube.com/embed/'+item.videoId+'?autoplay=1',
            source:'youtube'
        };
    });

    var swVideos = playerApp.swPlaylist.data.map(function (item) {
        return {
            videoId:item.token,
            title:item.title,
            thumbnail:item.thumbnail,
            embedUrl: 'http://stringwire.com/video/'+item.token+'/embed',
            source:'stringwire'
        };
    });

    var videos = [];
    if(source==='youtube') {
        videos = ytVideos;
    }
    else if (source==='stringwire') {
        console.log('###', swVideos);
        videos = swVideos;
    }
    else {
        videos = mpxVideos;
    }

    return videos;
}


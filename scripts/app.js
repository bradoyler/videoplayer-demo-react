
var Router = window.ReactRouter
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;

var App = React.createClass({

    getInitialState: function () {
        return { videos: getVideos() };
    },
    render: function () {
        return (
            <div className="playerApp">
                <RouteHandler />
                <Playlist items={this.state.videos} />
            </div>
        );
    }
});

var Index = React.createClass({

    contextTypes: {
        router: React.PropTypes.func
    },
    render: function () {
        var videoId = firstVideo().video.mpxId;
        this.context.router.transitionTo('video', {videoId: videoId})
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
                <ul className="playlist">
                    {playlistItems}
                </ul>
            </div>
        );
    }
});

var PlaylistItem = React.createClass({

    render: function () {
        var video = this.props.item.video;
        return (
            <li key={video.mpxId}>
                <Link to="video" params={{ videoId: video.mpxId }} >
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
        var item = findVideo(this.context.router.getCurrentParams().videoId);
        return (
            <div className="player">
                <h1>{item.video.title}</h1>
                <iframe src={item.video.embedUrl} width="580" height="430" />
            </div>
        );
    }
});

var routes = (
    <Route handler={App}>
        <DefaultRoute handler={Index}/>
        <Route name="video" path="video/:videoId" handler={Player}/>
    </Route>
);

var locationTypes = [Router.HashLocation, Router.HistoryLocation, Router.RefreshLocation];

Router.run(routes, locationTypes[0], function (Handler) {
    React.render(<Handler/>, document.getElementById('pdkplayer'));
});

/*****************************************************************************/
// Data Model

function findVideo(videoId) {

    var videos = getVideos();

    for (var i = 0, l = videos.length; i < l; i ++) {
        if (videos[i].video.mpxId === videoId) {
            return videos[i];
        }
    }
}

function firstVideo() {
    var videos = getVideos();
    return videos[0];
}

function getVideos() {
    //TODO: map results into a Model to allow videos from multiple sources
    return playerApp.playlist.results;
}

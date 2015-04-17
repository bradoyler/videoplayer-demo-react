
var Router = window.ReactRouter
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;

var App = React.createClass({displayName: "App",
    getInitialState: function () {
        return { videos: findVideos() };
    },

    render: function () {
        var links = this.state.videos.map(function (item) {
            return (
                <li key={item.video.mpxId}>
                    <Link to="video" params={{ mpxId: item.video.mpxId }} >
                    <span className="item_thumb">
                        <img className="thumb" src={item.video.thumbnail} width="80" height="60" />
                    </span>
                    <span className="item_title">
                        {item.video.title}
                    </span>
                    </Link>
                </li>
            );
        });

        return (
           <div className="app">
                <div className="player">
                    <RouteHandler/>
                </div>
                <ul className="playlist">
                    {links}
                </ul>
            </div>
        );
    }
});

var Index = React.createClass({
    contextTypes: {
        router: React.PropTypes.func
    },
    render: function () {
        var mpxId = findVideo().video.mpxId;
        this.context.router.transitionTo('video',{mpxId: mpxId})
        return (<span></span>);
    }
});

var Video = React.createClass({displayName: "Video",
    contextTypes: {
        router: React.PropTypes.func
    },

    render: function () {
        var item = findVideo(this.context.router.getCurrentParams().mpxId);
        var videoView =  (
            <div className="Video">
                <h1>{item.video.title}</h1>
                <iframe src={item.video.embedUrl} width="580" height="430" />
            </div>
        );
        return videoView;
    }
});

var routes = (
    <Route handler={App}>
        <DefaultRoute handler={Index}/>
        <Route name="video" path="video/:mpxId" handler={Video}/>
    </Route>
);

var locationTypes = [Router.HashLocation, Router.HistoryLocation, Router.RefreshLocation];
Router.run(routes, locationTypes[0], function (Handler) {
    React.render(<Handler/>, document.getElementById('pdkplayer'));
});

/*****************************************************************************/
// data stuff

function findVideo(mpxId) {
    var videos = findVideos();
    for (var i = 0, l = videos.length; i < l; i ++) {
        if (videos[i].video.mpxId === mpxId) {
            return videos[i];
        }
    }
    return videos[0]; // load 1st by default
}

function findVideos() {
    return playerApp.playlist.results;
}

function underscore(str) {
    return str.toLowerCase().replace(/ /, '_');
}
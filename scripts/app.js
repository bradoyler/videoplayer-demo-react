
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
                    <Link
                        to="video"
                        params={{ mpxId: item.video.mpxId }}
                    >{item.video.title}</Link>
                </li>
            );
        });

        return (
           <div className="App">
                <div className="Player">
                    <RouteHandler/>
                </div>
                <ul className="Playlist">
                    {links}
                </ul>
            </div>
        );
    }
});

//var Index = React.createClass({
//    render: function () {
//        this.context.router.transitionTo('video/123123')
//        return;
//    }
//});

var Video = React.createClass({displayName: "Video",
    contextTypes: {
        router: React.PropTypes.func
    },

    render: function () {
        var item = findVideo(this.context.router.getCurrentParams().mpxId);
        var videoView =  (
            <div className="Video">
                <h1>{item.video.title}</h1>
                <iframe src={item.video.embedUrl} width="600" height="480" />
            </div>
        );
        return videoView;
    }
});

var routes = (
    <Route handler={App}>
        <DefaultRoute handler={Video}/>
        <Route name="video" path="video/:mpxId" handler={Video}/>
    </Route>
);

Router.run(routes, function (Handler) {
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
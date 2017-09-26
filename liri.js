
var fs = require('fs');
var request = require('request');
var keys = require('./keys.js');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');

var myTweets = new Twitter({
	consumer_key: keys.consumer_key,
 	consumer_secret: keys.consumer_secret,
 	access_token_key: keys.access_token_key,
 	access_token_secret: keys.access_token_secret
});
var spotify = new Spotify({
	id: keys.twitterId,
	secret: keys.twitterSecret
});
 var liriDo = process.argv[2];
 var input = '';
 	for(i = 3; i < process.argv.length; i++) {
	input = input + ' ' +process.argv[i];
 	}	
	input = input.trim();
var	log = [];		
var	tweets = function(){
	myTweets.get('statuses/user_timeline',function(error, tweets, response) {
		if (!error) {
			for (i = 0; i < tweets.length; i++) {
				myText = tweets[i].text;
				date = tweets[i].created_at;
			theTweets = 'Date tweeted: ' +date +' ' + 'Tweet: '+ myText;
			log.splice(i,0,theTweets); 
				console.log(logTweets);
			}	
			console.log(log);
			logToFile(liriDo,log);
		} else {
			return console.log(error);
		}
	});
};
var	spotifyIng = function (input) {
	spotify.search({type: "track", query: '"'+input+'"', limit: 1},function(err,data) {
		if ( err ) {
		return console.log('Error occurred: ' + err);
		}
		var songDate = data.tracks.items[0]; 
		var artistList = [];
		var song = songDate.name;
		var previewLink = songDate.preview_url;
		var album = songDate.album.name;
		var artists = songDate.album.artists;
			for (var i = 0; i < artists.length; i++) {
				artistList.push(artists[i].name);
			}  
			artistList.slice(' , ');
		log = 'Artist(s): '+ artistList + '\n' + 'Song: ' +song+ '\n' 	+ 'Preview Link: '+ previewLink + '\n' + 'Album: '+ album;  
		console.log(log);
		logToFile(liriDo,log);					
		});
};
var	movie = function (input){
	var queryUrl = "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=40e9cece";
	request(queryUrl,function(error, response, body){
		if(error){
			return console.log('ERROR OCCURED' + error);
		}
		var body = JSON.parse(body);
		var title = body.Title;
		var year = body.Year;
		var rating = body.imdbRating;
		var rottenIndex = body.Ratings;
		for (i = 0; i < rottenIndex.length; i++){
			if(rottenIndex[i].Source === 'Rotten Tomatoes'){
				rottenIndex = i;
				var rotten = body.Ratings[rottenIndex].Value;					
				break;
			} else {
				rotten = 'N/A';
			}
		}
		var country = body.Country;
		var language = body.Language;
		var plot = body.Plot;
		var actors = body.Actors.toString();
		log = 'Title: '+ title + '\n' + 'Year: ' +year+ '\n' 	+ 'Rating: '+ rating + '\n' +'Rotten Ketchup: '+ rotten  +
		'\n' + 'Country: ' + country + '\n' + 'Language: ' + language + '\n'+
			'Plot: ' + plot + '\n' + 'Actors: ' + actors;
		console.log(log);
		logToFile(liriDo,log);			
	});
}; 	
liriThings = function(liriDo,input){
	console.log('liriDo is: '+ liriDo + ' ' +'\ninput is: ' + input);
	if (liriDo === 'my-tweets') {
		tweets();
	} else if (liriDo === 'spotify-this-song') {
//If no song is provided then your program will default to "The Sign" by Ace of Base//				
		if (input === undefined || input === '') {
			input = "The Sign";
			spotifyIng('The Sign');
		} else spotifyIng(input);
	} else if (liriDo === 'movie-this') {
// If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'//
		if(input === undefined || input === '') {
			movie("Mr. Nobody");
		} else {
			movie(input);
		}
	} else if (liriDo === 'do-what-it-says'){
// LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.//	
		input = fs.readFileSync('./random.txt','utf8');
		input = input.split(',');
		liriDo = input[0];
		input = input[1];
		liriThings(liriDo,input);
		logToFile(liriDo,log);
	}
}	
liriThings(liriDo,input);
var logToFile = function(liriDo, log) {
	fs.appendFile('./log.txt','\n**Begin New Log @ ' +liriDo+ ' - logDate = ' + Date	()+'**' + '\n'+ 	log+ '\n**End New Log @ ' +liriDo+ '**','utf8',function	(error){
			if(error){
				return console.log('LOGGING ERROR! '+ error);
			}
			// console.log('logging success');
		});	
}

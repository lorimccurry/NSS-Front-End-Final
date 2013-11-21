var async = require('async');
var __ = require('lodash');
var Twit = require('twit');
var express = require('express');
var mongoose = require('mongoose');
var Tweet = mongoose.model('Tweet');
var Twit = require('twit');
var io;

exports.connection = function(socket){
  var io = this;
  // console.log(socket);
  socket.emit('connected', {status: 'connected'});

  var T = new Twit({

  });
  // locations: ['122.75','36.8','-121.75','37.8']
  var stream = null;

  socket.on('disconnect', function(){
   // stream.close()
  });
  socket.on('startsearch', function(data){
    console.log(data)
    stream = T.stream('statuses/filter', { track: data.query, lang: 'en' , geo_enabled: true});
    stream.on('tweet', function (tweet) {
      if(tweet.geo) {
        //console.log(tweet);
        var newTweet = new Tweet({
          geo: tweet.geo.coordinates,
          screen_name: tweet.user.screen_name,
          name: tweet.user.name,
          lang: tweet.lang,
          text: tweet.text,
          profile_image_url: tweet.user.profile_image_url,
          //place_name: tweet.place.name,
          //place_full_name: tweet.place.full_name
        });
        newTweet.save(function(err, newTweet){

          // Send to sockets
          if (err){
            console.log('Error: ' + err.message);
          } else {
            console.log('inserted into database');
            socket.emit("newTweet",{
              geo: tweet.geo.coordinates,
              screen_name: tweet.user.screen_name,
              name: tweet.user.name,
              lang: tweet.lang,
              text: tweet.text,
              profile_image_url: tweet.user.profile_image_url
              //place_name: tweet.place.name,
              //place_full_name: tweet.place.full_name
            })
          }
        });

      }
    });

    stream.on('tweet', function (tweet) {
      //console.log('TWWEETTY!***************************');
    });

    stream.on('delete', function (deleteMessage) {
      console.log('DELETED TWEET!#################');
      console.log(deleteMessage);
    });

    stream.on('scrub_geo', function (scrubGeoMessage) {
      console.log('SCRUB GEO ' + scrubGeoMessage);
    });

    stream.on('limit', function (limitMessage) {
      console.log('LIMIT MESSAGE ' + limitMessage);
    });

    stream.on('disconnect', function (disconnectMessage) {
      console.log('DISCONNECT MESSSAGE ' + disconnectMessage);
    });

    stream.on('connect', function (request) {
      console.log('CONNECT ATTEMPT ' , request);
    });
  });

};

function socketStartSearch(data){

  console.log('this is the socket', data);




//   function(query,fn){m.newQuery(query,fn);
// }

// new Tweet({name: data.name}).save(function(err, tweet){
//     Tweet.findById(tweet.id).populate('query').exec(function(err, tweet){
//       console.log('created new tweet');
//     });
//   });
}

function socketDisconnect(){
}

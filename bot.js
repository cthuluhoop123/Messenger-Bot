const login = require("facebook-chat-api")

const translate = require('node-google-translate-skidz')

const scraper = require('google-search-scraper')

const search = require('youtube-search')

const fs = require('fs')

const gis = require('g-i-s')

const Anime = require('malapi').Anime;

const admin = 'Your facebook id'

  login({email: "", password: "" /*facebook credentials here*/}, function callback (err, api) {
      if(err) return console.error(err);

      api.setOptions({listenEvents: true});

      var stopListening = api.listen(function(err, event) {
          if(err) return console.error(err);

          switch(event.type) {
            case "message":
            var content = event.body.toUpperCase().split(' ')
            switch(content[0]){

                case "!MAL":
                content.shift()
                Anime.fromName(content.join(' ')).then(anime => {
                api.sendMessage(anime.title + ":\n" + anime.synopsis + '\nEpisodes: ' + anime.episodes +
                '\nStatus: ' + anime.status + '\nAired: ' + anime.aired + '\nType: ' + anime.type +
                '\nRating: ' + anime.statistics.score.value + "/10" + "\nGenres: " + anime.genres +
                '\nMore Info: ' + anime.detailsLink + '\n', event.threadID);
                });
                break;

                case '!YT':
                content.shift()
                var you = content.join(' ')
                var opts = {
                maxResults: 1,
                key: ''
                }

                search(you, opts, function(err, results) {
                if(err) return console.log(err);
                  console.log(results.map(u => u.link))
                  api.sendMessage(results.map(u => u.link).toString(), event.threadID)
                })
                break;

                case '!PIC':
                content.shift()
                var im = content.join(' ')
                gis(im, logResults)
                function logResults(error, results) {
                  if (error) {
                    console.log(error);
                  }
                  else {
                  var list = results.map(u => u.url)
                  var finalr = list[Math.floor(Math.random()*list.length)]
                  var msg = {

                  url: finalr
                  }
                  api.sendMessage(msg, event.threadID);

                  }
                }
                break;

                case "!ANALYSIS":
                  api.sendMessage('The ID of this chat is: ' + event.threadID, event.threadID)
                break;

                case '!GETHELP':
                  api.addUserToGroup(admin, event.threadID, function(err) {
                    if(err) {
                      api.sendMessage('Error! Owner may already be present...', event.threadID)
                      console.log(err)
                    }else{
                      api.sendMessage('Added bot owner to help!', event.threadID)
                    }
                  })
                break;

                case '!PING':
                  api.sendMessage('Pong!', event.threadID)
                break;

                case '!HELP':
                  api.sendMessage('Hello! Here are my commands:' +
                                  '\n!pic [picture tags] (Grabs image according to term from google.)' +
                                  '\n!yt [video title/name/search term] (Grabs video from youtube.)' +
                                  '\n!analysis (Sends back chat rooms id.)' +
                                  '\n!gethelp (Adds bot developer to the chat group.)' +
                                  '\n!ping (pong!)', event.threadID)
                break;

            }
          break;

          }
      })
  })

$(() => {
  //PROOF OF CONCEPT, TESTING STUFF
  let channel = '';
  let video = '';
  let videoContainer = 'test';

  $.get('https://api.twitch.tv/kraken/streams/' + channel, (data) => {
    if (data.stream){
      console.log('CHANNEL IS LIVE');
      console.log(data);
    } else if (data.stream === null){
      console.log('CHANNEL IS OFFLINE');
      console.log(data);
    } else {
      console.log('You entered a channel that does not exist.');
    }
  });

  function createPlayer(channel, video, videoContainer) {
    let playerScript = "<script type='text/javascript'>\
                           let options = {\
                               width: 854,\
                               height: 480,\
                               channel: '" + channel + "',\
                               video: '" + video + "',\
                           };\
                           let player = new Twitch.Player('" + videoContainer + "', options);\
                           player.setVolume(0.5);\
                       </script>";
  }

  function createChat(channel) {
    let chatScript = "<iframe frameborder='0'\
                         scrolling='no'\
                         id='chat_embed'\
                         src='http://www.twitch.tv/" + channel + "/chat'\
                         height='200'\
                         width='854'>\
                     </iframe>"
  }

});

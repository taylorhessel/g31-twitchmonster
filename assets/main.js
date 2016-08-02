// https://api.twitch.tv/kraken/streams/' + 'dota2ti'

$(() => {

  $('#welcome-form').on('submit', (e) => {
    e.preventDefault();
    let channel = $('#welcome-form').find('input').val();
  });

  $('.channel-input').on('keyup', (e) => {
    delay(() => {
      $.get('https://api.twitch.tv/kraken/streams/' + $(e.target).val(), (data) => {
        if ($(e.target).val() !== '' && data.stream !== null) {
          $(e.target).parent().find('span').addClass('icon glyphicon glyphicon-ok');
        }
      });
    }, 400);
  });

  let delay = (() => {
    let timer = 0;
    return function(callback, ms){
      clearTimeout (timer);
      timer = setTimeout(callback, ms);
    };
  })();

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

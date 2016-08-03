$(() => {

  $('form').on('submit', (e) => {
    let vWidth = window.innerWidth;
    let vHeight = window.innerHeight;
    e.preventDefault();
    let streams = [];
    $('.valid').each((i, el) => {
      let $channelName = $(el);
      streams.push($channelName.val());
    });
    let streamCount = streams.length;
    $('#site-description').animate({opacity: 0}, 300, () => {
      $('#site-description').remove();
      $('body').append(createPlayer(streams[0], vWidth * 0.8, vHeight, 'stream-wrapper'));
      $('#chat-wrapper').append(createChat(streams[0], vWidth * 0.2, vHeight));
    });
  });

  $('.channel-input').on('keyup', (e) => {
    delay(() => {
      $.get('https://api.twitch.tv/kraken/streams/' + $(e.target).val(), (data) => {
        if ($(e.target).val() !== '' && data.stream !== null) {
          $(e.target).parent()
            .find('span')
            .removeClass('glyphicon-remove')
            .addClass('glyphicon-ok')
          $(e.target).addClass('valid');
        } else if (data.stream === null) {
          $(e.target).parent()
            .find('span')
            .removeClass('glyphicon-ok')
            .addClass('glyphicon-remove')
          $(e.target).removeClass('valid');
        } else {
          $(e.target).parent()
            .find('span')
            .removeClass('glyphicon-remove glyphicon-ok')
          $(e.target).removeClass('valid');
        }
      })
      .fail((data) => {
        if ($(e.target).val() !== '') {
          $(e.target).parent()
            .find('span')
            .removeClass('glyphicon-ok')
            .addClass('glyphicon-remove')
        }
      });
    }, 300);
  });

  let delay = (() => {
    let timer = 0;
    return function(callback, ms){
      clearTimeout (timer);
      timer = setTimeout(callback, ms);
    };
  })();

  function createPlayer(channel, width, height, streamContainer) {
    let playerScript = "<script type='text/javascript'>\
                           let options = {\
                               width: " + width + ",\
                               height: " + height + ",\
                               channel: '" + channel + "',\
                           };\
                           let player = new Twitch.Player('" + streamContainer + "', options);\
                           player.setVolume(0.5);\
                       </script>";

    return playerScript;
  }

  function createChat(channel, width, height) {
    let chatScript = "<iframe frameborder='0'\
                         scrolling='no'\
                         id='chat_embed'\
                         src='http://www.twitch.tv/" + channel + "/chat'\
                         width=" + width + "\
                         height=" + height + ">\
                     </iframe>"

    return chatScript;
  }

});

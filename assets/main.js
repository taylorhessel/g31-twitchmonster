$(() => {

  //GLOBALS
  let streamCounter = 0;

  //ADD CHANNEL INPUT
  $('#add-stream').on('click', () => {
    if ($('#welcome input').length <= 4) {
      streamCounter++;
      $('#welcome-form-additional-inputs').append(addInput(streamCounter));
      $('.channel-input').last().focus();
    }
  });

  //REMOVE CHANNEL INPUT
  $('form').on('click', '.remove-stream', (e) => {
    $(e.target).closest('.added-input-row').remove();
    $('.channel-input').last().focus();
  });

  //DYNAMICALLY VALIDATE CHANNEL NAMES AND STREAM STATUS
  $('form').on('keyup', '.channel-input', (e) => {
    delay(() => {
      $.get('https://api.twitch.tv/kraken/streams/' + $(e.target).val(), (data) => {
        if ($(e.target).val() !== '' && data.stream !== null) {
          $(e.target).parent()
            .find('span')
            .removeClass('glyphicon-remove invalid')
            .addClass('glyphicon-ok valid')
          $(e.target).addClass('online');
        } else if (data.stream === null) {
          $(e.target).parent()
            .find('span')
            .removeClass('glyphicon-ok valid')
            .addClass('glyphicon-remove invalid')
          $(e.target).removeClass('online');
        } else {
          $(e.target).parent()
            .find('span')
            .removeClass('glyphicon-remove glyphicon-ok')
          $(e.target).removeClass('online');
        }
      })
      .fail((data) => {
        if ($(e.target).val() !== '') {
          $(e.target).parent()
            .find('span')
            .removeClass('glyphicon-ok valid')
            .addClass('glyphicon-remove invalid')
        }
      });
    }, 300);
  });

  //DELAY USED WITH DYNAMIC VALIDATION
  let delay = (() => {
    let timer = 0;
    return function(callback, ms){
      clearTimeout (timer);
      timer = setTimeout(callback, ms);
    };
  })();

  // LOAD ONLINE STREAMS AND CHATS
  $('form').on('submit', (e) => {
    e.preventDefault();  //HOLD THE PHONE
    let vWidth = window.innerWidth;
    let vHeight = window.innerHeight;
    let onlineStreams = [];
    $('.online').each((i, el) => {
      let $channelName = $(el);
      onlineStreams.push($channelName.val());
    });
    let onlineCount = onlineStreams.length;
    if (onlineCount === 1) {
      $('#welcome').animate({opacity: 0}, 300, () => {
        $('#welcome').remove();
        for (stream in onlineStreams) {
          $('#stream-wrapper').append('<div id="stream-' + stream + '" class="aspect-1"></div>');
          $('body').append(createPlayer(onlineStreams[stream], vWidth * 0.8, vHeight, 'stream-' + stream));
          $('#chat-wrapper').append(createChat(onlineStreams[stream], vWidth * 0.2, vHeight));
        }
      });
    } else if (onlineCount === 2) {
      $('#welcome').animate({opacity: 0}, 300, () => {
        $('#welcome').remove();
        for (stream in onlineStreams) {
          $('#stream-wrapper').append('<div id="stream-' + stream + '" class="aspect-2"></div>');
          if (stream == 0) {
            $('body').append(createPlayer(onlineStreams[stream], vWidth * 0.8, vHeight * 0.5, 'stream-' + stream));
            //$('#chat-wrapper').append(createChat(onlineStreams[0], vWidth * 0.2, vHeight));
          } else {
            $('body').append(createPlayer(onlineStreams[stream], vWidth * 0.8, vHeight * 0.5, 'stream-' + stream, true));
            //$('#chat-wrapper').append(createChat(onlineStreams[0], vWidth * 0.2, vHeight));
          }
        }
      });
    } else { //ERROR HANDLING
      $('#error')
        .addClass('text-danger')
        .text('Please enter at least one online channel.')
        .fadeIn(500)
        .delay(3000)
        .fadeOut(500)
    }
  });

  //ADD PLAYER SCRIPT
  function createPlayer(channel, width, height, streamContainer, muted = false) {
    return "<script type='text/javascript'>\
               let options = {\
                 width: " + width + ",\
                 height: " + height + ",\
                 channel: '" + channel + "',\
               };\
               let player = new Twitch.Player('" + streamContainer + "', options);\
               player.setVolume(0.5);\
               player.setMuted(" + muted + ");\
               console.log(" + muted + ");\
           </script>";
  }

  //ADD CHAT SCRIPT
  function createChat(channel, width, height) {
    return "<iframe frameborder='0'\
               scrolling='no'\
               id='chat_embed'\
               src='https://www.twitch.tv/" + channel + "/chat'\
               width=" + width + "\
               height=" + height + ">\
           </iframe>"
  }

  // ADD CHANNEL INPUT AND REMOVE BUTTON
  function addInput(streamCounter) {
    return "<div class='added-input-row group'>\
              <div class='added-input-wrapper'>\
                <input type='text' name='channel-" + streamCounter + "' id='channel-" + streamCounter + "'class='form-control channel-input added-input' placeholder='Enter a channel name here'>\
                <span class='icon glyphicon'></span>\
              </div>\
              <button type='button' class='remove-stream btn-primary btn glyphicon glyphicon-remove'></button>\
            </div>"
  }

});

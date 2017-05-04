
 var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
      + '</tr>'
      ;

      var $row = $(template);
  var clickHandler = function() {
      var songNumber = parseInt($(this).attr('data-song-number'));

      	if (currentlyPlayingSongNumber !== null) {
      		// Revert to song number for currently playing song because user started playing new song.
      		var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
      		currentlyPlayingCell.html(currentlyPlayingSongNumber);
        }
      	if (currentlyPlayingSongNumber !== songNumber) {
      		// Switch from Play -> Pause button to indicate new song is playing.
      		$(this).html(pauseButtonTemplate);
      		setSong(songNumber);
            currentSoundFile.play();
            updateSeekBarWhileSongPlays()
            updatePlayerBarSong();

      	} else if (currentlyPlayingSongNumber === songNumber) {
      		// Switch from Pause -> Play button to pause currently playing song.

      		if(currentSoundFile.isPaused()){

                $(this).html(pauseButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPauseButton);
                currentSoundFile.play();
                updateSeekBarWhileSongPlays()
            } else {

                $(this).html(playButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPlayButton);
                currentSoundFile.pause();
            }
      	}
  };

  var onHover = function(event) {

      var songNumber = parseInt($(this).find('.song-item-number').attr('data-song-number'));
      var songNumberCell = getSongNumberCell(songNumber);

      if (songNumber !== currentlyPlayingSongNumber) {
          songNumberCell.html(playButtonTemplate);
      }
  };

  var offHover = function(event) {

      var songNumber = parseInt($(this).find('.song-item-number').attr('data-song-number'));
      var songNumberCell = getSongNumberCell(songNumber);

      if (songNumber !== currentlyPlayingSongNumber) {
          songNumberCell.html(songNumber);
      }
  };

      $row.find('.song-item-number').click(clickHandler);
      $row.hover(onHover, offHover);

      return $row;
 };

 var setCurrentAlbum = function(album) {

      currentAlbum = album;

      var $albumTitle = $('.album-view-title');
      var $albumArtist = $('.album-view-artist');
      var $albumReleaseInfo = $('.album-view-release-info');
      var $albumImage = $('.album-cover-art');
      var $albumSongList = $('.album-view-song-list');

      $albumTitle.text(album.title);
      $albumArtist.text(album.artist);
      $albumReleaseInfo.text(album.year + ' ' + album.label);
      $albumImage.attr('src', album.albumArtUrl);

      $albumSongList.empty();
      for (var i = 0; i < album.songs.length; i++) {
            var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
            $albumSongList.append($newRow);
      }
  };
  var updateSeekBarWhileSongPlays = function() {
    if (currentSoundFile) {
        // #10
        currentSoundFile.bind('timeupdate', function(event) {
            // #11
            var seekBarFillRatio = this.getTime() / this.getDuration();
            var $seekBar = $('.seek-control .seek-bar');
            setCurrentTimeInPlayerBar(this.getTime());
            updateSeekPercentage($seekBar, seekBarFillRatio);
        });
    }
};
  var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
     var offsetXPercent = seekBarFillRatio * 100;
     // #1
     offsetXPercent = Math.max(0, offsetXPercent);
     offsetXPercent = Math.min(100, offsetXPercent);

     // #2
     var percentageString = offsetXPercent + '%';
     $seekBar.find('.fill').width(percentageString);
     $seekBar.find('.thumb').css({left: percentageString});
  };
 var setCurrentTimeInPlayerBar = function(currentTime){
      var currentTimeDisplay = $('.currently-playing .current-time');

      if(currentSoundFile){
          currentTimeDisplay.text(buzz.toTimer(currentTime));
      } else currentTimeDisplay.text("-:--");
  };

  var setTotalTimeInPlayerBar = function(totalTime){
     $('.total-time').text(buzz.toTimer(totalTime));
  };
  var setupSeekBars = function() {
    var $seekBars = $('.player-bar .seek-bar');

    $seekBars.click(function(event) {

        var offsetX = event.pageX - $(this).offset().left;
        var barWidth = $(this).width();

        var seekBarFillRatio = offsetX / barWidth;
        updateSeekPercentage($(this), seekBarFillRatio);

        if($(this).parent().attr('class') === "control-group volume"){
            currentSoundFile.setVolume(seekBarFillRatio * 100);
        }else if($(this).parent().attr('class') === "seek-control"){
            seek(seekBarFillRatio * currentSoundFile.getDuration());
        };

    });
    $seekBars.find('.thumb').mousedown(function(event) {
        // #8
        var $seekBar = $(this).parent();
        if($(this).parent().parent().attr('class') === "seek-control"){
            currentSoundFile.pause();
        }
        // #9
        $(document).bind('mousemove.thumb', function(event){
            var offsetX = event.pageX - $seekBar.offset().left;
            var barWidth = $seekBar.width();
            var seekBarFillRatio = offsetX / barWidth;
            updateSeekPercentage($seekBar, seekBarFillRatio);
            setCurrentTimeInPlayerBar(seekBarFillRatio * currentSoundFile.getDuration());
            if($(this).parent().attr('class') === "control-group volume"){
                currentSoundFile.setVolume(seekBarFillRatio * 100);
            }else if($(this).parent().attr('class') === "seek-control"){
                seek(seekBarFillRatio * currentSoundFile.getDuration());
            }

        });

        // #10
        $(document).bind('mouseup.thumb', function() {
            $(document).unbind('mousemove.thumb');
            $(document).unbind('mouseup.thumb');

            currentSoundFile.play();
        });
    });
};
var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
};

var nextSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    // Note that we're _incrementing_ the song here
    currentSongIndex++;

    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }

    // Save the last song number before changing it
    var lastSongNumber = currentlyPlayingSongNumber;

    // Set a new current song
    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays()

    // Update the Player Bar information
    updatePlayerBarSong();

    var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var previousSong = function() {
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);

    currentSongIndex--;

    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }

    // Save the last song number before changing it
    var lastSongNumber = currentlyPlayingSongNumber;

    // Set a new current song
    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updateSeekBarWhileSongPlays()


    // Update the Player Bar information
    updatePlayerBarSong();
    $('.main-controls .play-pause').html(playerBarPauseButton);

    var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
    var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
};

var setSong = function(songNumber) {

    if (currentSoundFile) {
      currentSoundFile.stop();
    }
    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
      formats: [ 'mp3' ],
      preload: true
    });
  setVolume(currentVolume);
};

var setVolume = function(volume) {
     if (currentSoundFile) {
         currentSoundFile.setVolume(volume);
     }
 };

 var updateVolumeBar = function(volume){
     var $seekBar = $(".control-group.volume .seek-bar");
     updateSeekPercentage($seekBar, volume / 100);
 }

 var seek = function(time) {
     if (currentSoundFile) {
         currentSoundFile.setTime(time);
     }
 };

var getSongNumberCell = function(songNumber) {
    return $('.song-item-number[data-song-number="' + songNumber + '"]');
};

var updatePlayerBarSong = function() {

     $('.currently-playing .song-name').text(currentSongFromAlbum.title);
     $('.currently-playing .artist-name').text(currentAlbum.artist);
     $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
     $('.main-controls .play-pause').html(playerBarPauseButton);
     setTotalTimeInPlayerBar(currentSongFromAlbum.duration);
 };
var togglePlayFromPlayerBar = function() {
    if(currentSoundFile.isPaused()){
        var $currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
        $currentlyPlayingCell.html(pauseButtonTemplate);
        $mainPlayButton.html(playerBarPauseButton);
        currentSoundFile.play();
    } else if(currentSoundFile){
        var $currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
        $currentlyPlayingCell.html(playButtonTemplate);
        $mainPlayButton.html(playerBarPlayButton);
        currentSoundFile.pause();
    }
};
var filterTimeCode = function(timeInSeconds){
    timeInSeconds = parseFloat(timeInSeconds);
    var minutes =  Math.floor(timeInSeconds / 60)
    var seconds =  Math.floor(timeInSeconds % 60);
    return minutes + ":" + seconds;

};
 var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
 var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
 var playerBarPlayButton = '<span class="ion-play"></span>';
 var playerBarPauseButton = '<span class="ion-pause"></span>';

 var currentAlbum = null;
 var currentlyPlayingSongNumber = null;
 var currentSongFromAlbum = null;
 var currentSoundFile = null;
 var currentVolume = 50;

 var $mainPlayButton = $(".main-controls .play-pause")
 var $previousButton = $('.main-controls .previous');
 var $nextButton = $('.main-controls .next');

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
    $mainPlayButton.click(togglePlayFromPlayerBar);
    setupSeekBars();
    updateVolumeBar(currentVolume);
});

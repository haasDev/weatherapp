'use strict';

//As a user, I can see the weather in my current location.
navigator.geolocation.getCurrentPosition(getLocation);

function getLocation(currentLocation) {
  var lat = currentLocation.coords.latitude;
  var lon = currentLocation.coords.longitude;
  var api = '90a0b183cd83df1dad0619d128058cbb';
  
  var icons = { 'clear-day'           : 'B',
                'clear-night'         : 'C',
                'rain'                : 'R',
                'snow'                : 'G',
                'sleet'               : 'X',
                'wind'                : 'S',
                'fog'                 : 'N',
                'cloudy'              : 'Y',
                'partly-cloudy-day'   : 'H',
                'partly-cloudy-night' : 'I'};

  $.ajax({
    url: 'https://api.forecast.io/forecast/' + api + '/' + lat + ',' + lon,
    jsonpCallback: 'jsonCallback',
    contentType: 'application/json',
    dataType: 'jsonp',
    success: function(data){
      var now = data.currently;
      var temp = Math.round(now.temperature);
      var whiteText = ['clear-night', 'wind', 'cloudy', 'partly-cloudy-night'];

      if (whiteText.indexOf(now.icon) != -1) {
        $('.content').css('color', 'white');
      }

      $('#current_temp').prepend(temp);

      //As a user, I can see an icon depending on the temperature.
      $('#current_temp').attr('data-icon', icons[now.icon]);
      $('#current_summary').text(now.summary);
      // As a user, I see a different background image depending on the temperature (e.g. snowy mountain, hot desert).
      $('body').css('background-image', "url(img/"+now.icon+".png)");
    }
  });

  var regex = /F$/;

  //As a user, I can push a button to toggle between Fahrenheit and Celsius. 
  $('#converter').on('click', function(){
    
    if( regex.exec($('#current_temp').text()) ){
      temp = Math.round((temp - 32) * (5/9));
      $('#current_temp').html('&#176; C');
      $('button').text('Fahrenheit');
    } else {
      temp = Math.round(temp * (9/5) + 32);
      $('#current_temp').html('&#176; F');
      $('button').text('Celsius');
    }

    $('#current_temp').prepend(temp);

  });
}
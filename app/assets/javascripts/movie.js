$(document).ready(function() {
  init();
});

function init() {
  submit = $("div#submit");
  clickSubmit();
  clickTitle();
  showFavorites();
}

function clickSubmit() {
  submit.click(function() {
    $('#favorites_section').empty();
    $("#search_section").append("<div id='movie_results' class='column'><h2>Results</h2><div class='ui list'></div>,</div>\
      <div id='single_movie' class='column'>\
        <div class='ui two column grid'>\
          <div id='image' class='column'></div>\
          <div id='info' class='column'></div>\
        </div>\
      </div>");
    ajaxRequest(setUrl());
  })
}

function listTitles(jsonData) {
  // $("#movie_results").empty();
  for(var i = 0; i < jsonData["Search"].length; i++) {
    var title = jsonData["Search"][i].Title;
    var movieList = "\
      <div class='item'>\
        <div class='content'>\
          <a class='header'>" + title + "</a>\
        </div>\
      </div>"
    $("div.ui.list").append(movieList);
  }
}

function setUrl() {
  var input = $("input[type='text']").val();
  return "http://www.omdbapi.com/?s=" + input;
}

function ajaxRequest(url) {
  return $.ajax(url,
    {dataType: 'json'}
  ).done(function(data) {
    listTitles(data);
    setHtmlId(data);
  });
}

function setHtmlId(jsonData) {
  for(var i = 0; i < jsonData["Search"].length; i++) {
    var imdbId = jsonData["Search"][i].imdbID;
    $($('div.item')[i]).attr('data-imdbId', imdbId);
  }
}

function clickTitle() {
  $("#search_section").on("click", "a", function() { // how to not have it work when you click to the right as well?
    $("#image").empty();
    $("#info").empty();
    var url = "http://www.omdbapi.com/?i=" + $(this).parent().parent().attr('data-imdbId'); // this.data

    $.ajax(url, {dataType: 'json'}).done(function(data) {
      new_title = data["Title"];
      new_image_url = data["Poster"];
      new_year = data["Year"];
      new_plot = data["Plot"];

      var imageElement = "<img src='" + new_image_url + "'>";
      var infoElement = "<h3>" + new_title + "</h3><p>" + new_year + "</p><p>" + new_plot + "</p>";
      var favoriteElement = '<span id="favorite"><i class="flag icon"></i>Save to favorites</span>';
      $("#image").append(imageElement);
      $("#info").append(infoElement, favoriteElement);
    });
  });

  $("#search_section").on('click', 'span#favorite', function() {
    $.ajax("/movies", {
      type: 'post',
      data: {
        movie: {
          title: new_title,
          year: new_year,
          plot: new_plot,
          image_url: new_image_url,
          favorite: true,
          rating: 0,
        }
      }
    }).done(function(data) {
      console.log("saved");
    });
  });

}

function showFavorites() {
  $("#showfav").click(function() {
    $('#favorites_section').empty();
    $.ajax("/movies", {dataType: 'json'}).done(function(data) {
      $("#search_section").empty();

      var cardGallery = "<div class='ui cards'></div>";
      $("#favorites_section").append(cardGallery);
      for(var i = 0; i < data.length; i++) {
        var favorite_movie = '\
          <div class="card" data-id="' + data[i].id + '">\
            <div class="image">\
              <img src="' + data[i].image_url + '">\
            </div>\
            <div class="content">\
              <div class="header">' + data[i].title + '</div>\
              <div class="meta">\
                <a class="group">' + data[i].year + '</a>\
              </div>\
            </div>\
            <div class="extra content">\
              <a class="right floated created">' + data[i].rating + '</a>\
              <i class="delete icon"></i>\
            </div>\
          </div>';
        $(".cards").append(favorite_movie);
      }

    });
  });

  $("#favorites_section").on('click', 'i.delete', function(event) {
    var id = $(this).parent().parent().data('id');
    var url = '/movies/' + id;

    $.ajax(url, {type: 'delete'}).done(function(data) {
      var card = $('div.card[data-id="' + data.id + '"]');
      card.fadeOut(function() {
        card.remove();
      });
    });
  });


}

var offset = 0;
var limit = 20;
var totalCount = 0;
var token = 0;
var baseURL = "https://pokeapi.co/api/v2/pokemon/";

// FUNCTION TO GET ALL POKEMON LIST
function getAllPokemonList(baseURL) {

    $.ajax({
        type: 'GET',
        url: baseURL,
        contentType: 'application/json',
        success: function (response) {

            var pokemonList = response.results;
            totalCount = response.count;

            // FOR FIRST PAGE LOAD
            if (token == 0) {
                $('#pokemonCount').text("Showing " + offset + " to " + limit + " of " + response.count + " pokemons");
            }

            // FOR CLEARING DATA FROM DOM
            $('#pokemonList').empty();
            $(pokemonList).each(function (index, element) {

                $('#pokemonList').append('<div class="col-lg-4">' +
                    '<div class="panel-body">' +
                    '<div class="row">' +
                    '<div class="col-md-10">' +
                    '<div class="pokemon-icon">' + element.name.match(/\b(\w)/g)[0] + '</div>' +
                    '<div class="pokemon-name">' + element.name + '</div>' +
                    '</div>' +
                    '<div class="col-md-2">' +
                    '<div class="pokemon-info" title="Info" pokemon-name=' + element.name + ' onClick="getPokemonDetailsById(' + element.url.split("/")[6] + ', this)">' +
                    '<i class="fas fa-info-circle"></i>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>');
            });
        },
        error: function (response) {
            console.log(JSON.stringify(response));
        }
    });
}


// FOR PREVIOUS BUTTON CLICK AND SHOWING PAGINATION DATE COUNT
$('#previousButton').click(function () {

    $('#nextButton').prop('disabled', false);
    token = 1;
    offset = offset - limit;
    if (offset == 0) {
        $('#previousButton').prop('disabled', true);
    }
    getAllPokemonList(baseURL + "?offset=" + offset + "&limit=" + limit);
    $('#pokemonCount').text("Showing " + offset + " to " + (Number(offset) + Number(limit)) + " of " + totalCount + " pokemons");
});



// FOR NEXT BUTTON CLICK AND SHOWING PAGINATION DATE COUNT
$('#nextButton').click(function () {

    $('#previousButton').prop('disabled', false);
    token = 1;
    offset = offset + limit;
    if ((offset + limit) >= totalCount) {
        $('#nextButton').prop('disabled', true);
        getAllPokemonList(baseURL + "?offset=" + offset + "&limit=" + (totalCount - offset));
        $('#pokemonCount').text("Showing " + offset + " to " + totalCount + " of " + totalCount + " pokemons");
    } else {
        getAllPokemonList(baseURL + "?offset=" + offset + "&limit=" + limit);
        $('#pokemonCount').text("Showing " + offset + " to " + (Number(offset) + Number(limit)) + " of " + totalCount + " pokemons");
    }
});



// GET POKEMON DETAILS BY ID
function getPokemonDetailsById(id, currObj) {

    var currObjPokemonName = $(currObj).attr('pokemon-name');
    $('.modal-title').text(currObjPokemonName + " Information").css('textTransform', 'capitalize');

    $.ajax({
        type: 'GET',
        url: baseURL + id + "/",
        contentType: 'application/json',
        success: function (response) {

            $('#baseExperience').text(response.base_experience);
            $('#height').text(response.height);
            $('#weight').text(response.weight);
            $(response.abilities.reverse()).each(function (index, element) {

                $('#abilities .card-body ul').append('<li>' + element.ability.name + '</li>');
            });
            $(response.forms).each(function (index, element) {

                $('#forms .card-body ul').append('<li>' + element.name + '</li>');
            });
            $(response.moves).each(function (index, element) {

                $('#moves .card-body ul').append('<li>' + element.move.name + '</li>');
            });
            $('#pokemonDetailModal').modal("show");

        },
        error: function (response) {
            console.log(JSON.stringify(response));
        }
    });
}


// SEARCH POKEMON
$("#searchPokemon").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#pokemonList .panel-body .pokemon-name").filter(function () {
        $(this).parent().parent().parent().parent().toggle($(this).text().toLowerCase().indexOf(value) > -1);
        $(this).parent().parent().parent().parent().parent().css('color', 'yellow');
    });
});


// ON PAGE LOAD CALL GET ALL POKEMON LIST API
getAllPokemonList(baseURL);
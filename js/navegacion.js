$(document).ready(function(){
function cargarPagina(seccion){
  $.ajax({
    type: 'GET',
    dataType: 'HTML',
    url: seccion,
    success: function(data){
          $('#conten').html(data);
        },
    error: function(){
          alert('Error al Cargar la Pagina de ' + seccion);
        }
  });
};

function cargarMenu(seccion){   // Carga asincronica del menu de usuario
  $.ajax({
    type: 'GET',
    dataType: 'HTML',
    url: seccion,
    success: function(data){
      $('#page').html(data);
    },
    error: function(){
          alert('Error al Cargar la Pagina de ' + seccion);
        }
  });
};
$('#usuarioMenu').change(function () { //esta funcion evalua si el valor del selector de usuario cambia de valor, en caso de ser asi cambia al menu correspondiente
  var seccion=$('#usuarioMenu').val();
  cargarMenu(seccion);
});


$('#hd').on('click', function(event){
    event.preventDefault();
    cargarPagina("hacerDenuncia");
  });

  $('#hdi').on('click', function(event){
      event.preventDefault();
      cargarPagina("hacerDenunciaInfraganti");
    });
  $('#home').on('click', function(event){
      event.preventDefault();
      cargarPagina("home");
    });

  $('#mb').on('click',function(event){ // captura el evento click de la opcion del menu del capataz para activar la generacion del mapa de la basura
    event.preventDefault();
    cargarPagina("mapaBasura"); //primero se carga el contenedor del mapa
    callPostAjax("marcadores"); // despues se cargan los marcadores al mapa
  });

  function dibujarMapaconMarcadores(resultData) {
    var mymap = L.map('mapid').setView([-37.32,-59.1401387], 13); // esta variable es el mapa, en esta se define la coordenada en donde estara centrado el mapa y el zoom que se vera
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic2VyZ2lvZ2FyY2lhcmV0ZWd1aSIsImEiOiJjanYwdXg1bmYxbXB6M3lzZG5xazYwZnd2In0.VQS4bmrDF7yKJqqALbcc5A', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1Ijoic2VyZ2lvZ2FyY2lhcmV0ZWd1aSIsImEiOiJjanYwdXg1bmYxbXB6M3lzZG5xazYwZnd2In0.VQS4bmrDF7yKJqqALbcc5A' //esta clave de acceso se obtiene desde la pagina de Leaflet de manera gratuita
     }).addTo(mymap);
    for (var i = 0; i < resultData.length; i++) { // se recorre el arreglo de denuncias sin cumplir y por cada una se agrega un marcador con un pop up
      var marcador = L.marker([resultData[i].latitud, resultData[i].longitud]).addTo(mymap);
      var link = $('<a href="#" id='+resultData[i].id_denuncia+' class="speciallink">Informar Cumplimiento</a>').click(function() { // el pop up se mostrara al hacer click sobre el marcador
      alert("hacer algo"); // aca deberia estar la llamada al metodo que dar por cumplida la tarea.
      })[0];
      marcador.bindPopup(link);
    }
  }
    function callPostAjax(dir) { // esta llamada solicita a la pagina las denuncias sin cumplir para agregar los marcadores al mapa.
      $.ajax({
          url : dir,
          method : "post",
          dataType :'json',
          contentType: "application/json; charset=utf-8",
          success : function (resultData) { // resultData contiene el JSON con el arreglo de denuncias sin cumplir
           dibujarMapaconMarcadores(resultData);
           console.log(resultData); // se agrego esta linea para testeo del retorno de las denuncias sin cumplir
         },
          error: function(){

            }
      });
   }

  function handleError(xmlhr, r, error) {
      console.log(error);
  }

  function mostrarAlerta (data, textStatus, jqXHR) {
      data = JSON.parse(data);
      $('.btn-denunciar').attr("disabled",false);
      $('.btn-denunciar').html('Denunciar');
      alertify.set('notifier','position', 'top-center');
      if (data.success){
        alertify.alert('Denuncia realizada', 'El numero de denuncia para su seguimiento es: '+data.id, function(){ alertify.success('Denuncia exitosa'); });
      }else{
        alertify.error('No se pudo realizar la denuncia');
      }
  }

  /*$('body').on("submit",'.form-infraganti', function (event) {
      event.preventDefault();
      var form = new FormData($('.form-infraganti')[0]);
      let link = 'publicarDenunciaInfraganti';
      $('.btn-denunciar').attr("disabled",true);
      $('.btn-denunciar').html('<i class="fas fa-circle-notch fa-spin"></i>');
      callPostAjax(link, form);
  })*/

});

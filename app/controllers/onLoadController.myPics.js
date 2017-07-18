'use strict';

(async function() {
    var grid = document.querySelector('.grid');

    function newGridElement(image) {
        var gridItem = document.createElement('div');
        gridItem.setAttribute("class", "grid-item text-center");
        gridItem.innerHTML = '<i class="fa fa-times-circle-o" aria-hidden="true" style="font-size:25px;" id=\"' + image._id + '\"></i>';
        gridItem.innerHTML += '<div class="grid-image"><img src=\"' + image.link + '\" class="img-fluid"></div>';
        gridItem.innerHTML += '<i class="fa fa-heart" aria-hidden="true" style="font-size:25px;" id=\".' + image._id + '\"></i>';
        grid.append(gridItem);
    }

    ajaxFunctions.ready(async function() {
        function fetchData() {
            return new Promise(function(resolve, reject) {
                ajaxFunctions.ajaxRequest('GET', appUrl + '/myPics', function(data) {
                    //console.log(data);
                    resolve(JSON.parse(data));
                });
            });
        }

        var data = await fetchData();
        data.forEach(image => newGridElement(image));
        console.log(data);
    });
})();

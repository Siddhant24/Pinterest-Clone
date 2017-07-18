'use strict';

(async function() {
    var grid = document.querySelector('.grid');

    function newGridElement(image) {
        var gridItem = document.createElement('div');
        gridItem.setAttribute("class", "grid-item text-center");
        gridItem.innerHTML = '<i class="fa fa-times-circle-o delete" aria-hidden="true" style="font-size:25px;" id=\"' + image._id + '\"></i>';
        gridItem.innerHTML += '<div class="grid-image"><img src=\"' + image.link + '\" class="img-fluid"></div>';
        gridItem.innerHTML += '<div class="caption-text text-center">' + image.caption + '</div>';
        gridItem.innerHTML += '<i class="fa fa-heart like" aria-hidden="true" style="font-size:20px;" id=\".' + image._id + '\"></i>' + image.number;
        grid.append(gridItem);
    }

    function addImages(data) {
        return new Promise(function(resolve, reject) {
            data.forEach((image, index) => {
                newGridElement(image);
                if (index === data.length - 1) resolve();
            });
        }).then(function() {
            console.log("added");
        });
    }

    function fetchData() {
        return new Promise(function(resolve, reject) {
            ajaxFunctions.ajaxRequest('GET', appUrl + '/myPics', function(data) {
                resolve(JSON.parse(data));
            });
        });
    }

    ajaxFunctions.ready(async function() {
        try {
            var data = await fetchData();
            await addImages(data.reverse());
            console.log(document.querySelectorAll('.delete').forEach(val => console.log(val)));
            document.querySelectorAll('.delete').forEach(val => val.addEventListener('click', function(e) {
                console.log(e.target.id);
                ajaxFunctions.ajaxPostRequest({
                    image_id: e.target.id
                }, appUrl + '/allPics', function(msg) {
                    console.log(msg);
                    if (msg === 'deleted') window.location.reload();
                });
            }));

            document.querySelectorAll('.like').forEach(val => val.addEventListener('click', function(e) {
                console.log(e.target.id.slice(1));
                ajaxFunctions.ajaxPostRequest({
                    image_id: e.target.id.slice(1)
                }, appUrl + '/myPics', function(msg) {
                    console.log(msg);
                    if(msg === 'added like' || msg === 'deleted like') window.location.reload();
                });
            }));
        }
        catch (msg) {
            console.log(msg);
        }
    });
})();

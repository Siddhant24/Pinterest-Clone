'use strict';

function imgError(image) {
    image.onerror = "";
    image.src = "/public/img/broken-image.jpg";
    return true;
}

(async function() {
    var grid = document.querySelector('.grid');

    function newGridElement(image) {
        var gridItem = document.createElement('div');
        gridItem.setAttribute("class", "grid-item text-center");
        gridItem.innerHTML += '<div class="grid-image"><img src=\"' + image.link + '\" class="img-fluid" onerror="imgError(this);"></div>';
        gridItem.innerHTML += '<div class="caption-text text-center">' + image.caption + '</div>';
        gridItem.innerHTML += '<button class="btn-link owner-link" id=\"' + image.owner._id + '\">' + image.owner.twitter.username + '</button>';
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
        });
    }

    function fetchData() {
        return new Promise(function(resolve, reject) {
            ajaxFunctions.ajaxRequest('GET', appUrl + '/allPics', function(data) {
                resolve(JSON.parse(data));
            });
        });
    }

    ajaxFunctions.ready(async function() {
        try {
            var data = await fetchData();
            await addImages(data.reverse());

            document.querySelectorAll('.like').forEach(val => val.addEventListener('click', function(e) {
                ajaxFunctions.ajaxPostRequest({
                    image_id: e.target.id.slice(1)
                }, appUrl + '/myPics', function(msg) {
                    if (msg === 'added like' || msg === 'deleted like') window.location.reload();
                    else if (msg === 'unauthenticated') window.alert("Login required to vote");
                });
            }));

            document.querySelectorAll('.owner-link').forEach(val => val.addEventListener('click', function(e) {
                window.location.href = window.location.origin + '/wall?id=' + e.target.id;
            }));
            
        }
        catch (msg) {
            console.log(msg);
        }
    });
})();

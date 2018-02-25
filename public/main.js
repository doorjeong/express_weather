$(function(){

    var $h1 = $("h1");
    var $zip = $("input[name='zip']");

    $("form").on("submit", function(e){
        e.preventDefault(); // 기존의 submit 이벤트를 죽임

        var zipCode = $.trim($zip.val());
        $h1.text("Loading...");

        var request = $.ajax({
            url: "/" + zipCode,
            dataType: "json"
        });
        request.done(function(data){
            var temperature = data.temperature;
            var celsius = parseInt((temperature-32) / 1.8 * 10)/10
            $h1.html("It is " + temperature + "℃, " + celsius + "℉ in " + zipCode + ".");
        });
        request.fail(function(){
            $h1.text("Error!");
        });

        console.log(zipCode);
    });

});

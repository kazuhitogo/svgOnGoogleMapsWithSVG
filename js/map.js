var data,map,overlay,layer,svg,lineLayer,markerOverLay,overlayProjection,googleMapProjection,googleCoordinates,pixelCoordinates,color,scaleColor;
d3.json("data/line.json", function(json) {
    data = json;
	main(data);
});

function main(data) {
	
	//Google Map 初期化
	map = new google.maps.Map(document.getElementById('map'), {
			zoom: 2,
            //地図のタイプを指定(ROADMAP)
			mapTypeId: google.maps.MapTypeId.ROADMAP,
            //地図の初期中心位置を指定
			center: new google.maps.LatLng(35,140),       
		  });

	overlay = new google.maps.OverlayView(); //OverLayオブジェクトの作成
	overlay.onAdd = function () {	
		//オーバーレイ設定
		layer = d3.select(this.getPanes().overlayLayer).append("div").attr("class", "SvgOverlay");
		svg = layer.append("svg");
		lineLayer = svg.append("g").attr("class", "AdminDivisions");
		markerOverlay = this;
		overlayProjection = markerOverlay.getProjection();

		//Google Projection作成
		googleMapProjection = function (coordinates) {
			googleCoordinates = new google.maps.LatLng(coordinates[1], coordinates[0]);
			pixelCoordinates = overlayProjection.fromLatLngToDivPixel(googleCoordinates);
			return [pixelCoordinates.x + 4000, pixelCoordinates.y + 4000];
		}

		//パスジェネレーター作成
		path = d3.geo.path().projection(googleMapProjection);　
            
		overlay.draw = function () {
            color = d3.scale.category10();
            scaleColor = color.domain([]);
			
			//地図描く
			lineLayer.selectAll("path")
                     .data(data.features)
				     .attr("d", path) 
			         .enter()
                     .append("svg:path")
                     .attr({
                         "d": path,
                         "class":function(d) { return "line" + d.id; },
                         "stroke":function(d){
                             console.log(scaleColor(d.id));
                             return scaleColor(d.id);
                         }
                     });
		};

	};

	//作成したSVGを地図にオーバーレイする
	overlay.setMap(map);		
};
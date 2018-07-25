	var url = '../file/mypdf.pdf';//此处路径为网络路径或者本地路径
    var scale = 1;//缩放程度，约大图片越清晰，同时也越久
    var totalNum =0;//总页数
	    
	
	//转为canvas
	PDFJS.getDocument(url).then(function(pdfFile) {
		if(pdfFile) {
			totalNum = pdfFile.numPages;
			$("#totalNum").text("共计"+totalNum+"页");
			for(var i = 1; i <= totalNum; i++) {
				var canvas = document.createElement('canvas');
				var cxt = canvas.getContext('2d');
				openPage(pdfFile, i, cxt);
			}
		}
	});

	function openPage(pdfFile, pageNumber, cxt) {
		pdfFile.getPage(pageNumber).then(function(page) {
			viewport = page.getViewport(scale); 
			var canvas = cxt.canvas;
			canvas.width = viewport.width;
			canvas.height = viewport.height;
			
			var renderContext = {
				canvasContext: cxt,
				viewport: viewport
			};
			
			var renderTask = page.render(renderContext);
			   
		    renderTask.promise.then(function() {

				var img=canvasToImage(canvas);  
				
				$('#img').append(img); 
				$('#img').find(img).attr("data-preview-src","");//预览时的路径，不设置时默认为当前路径。
				$('#img').attr("data-preview-group","1");//给img分组
				
				mui.previewImage();//此处可以在所有img控件添加完毕后再进行执行
		    });
		});
		return;
	};

	function canvasToImage(canvas) {
	    var image = new Image();  
	    image.src = canvas.toDataURL("image/png");  //将canvas转为base64
	    return image;  
	}
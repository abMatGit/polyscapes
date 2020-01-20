const landscapes = ["forrest.jpeg", "desert.jpeg", "gradient.jpeg", "yosemite.jpeg", "snow.jpeg", "peak.jpeg"]

var canvas = "";
const backgroundImg = new Image();
const treeImg = new Image();
const riverImg = new Image();
const t_italia = new Image();
const t_sad = new Image();
const t_luna = new Image();
const thienking = new Image();
const t_shade = new Image();
const t_meatball = new Image();

function drawPolygon(ctx, centerX,centerY, img, time, options = {}){
  ctx.save();
  ctx.translate(centerX,centerY);

  var sides = options.sides;
  var size = options.size || 400;
  var radians = 0;

  if(options.rotation) {
    if(options.rotation.animated) {
      radians = ((2 * Math.PI) / 6) * time.getSeconds() + ((2 * Math.PI) / 6000) * time.getMilliseconds();
    }
    if(options.rotation.offset) { radians += options.rotation.offset }
    if(options.rotation.direction == 'counter-clockwise') { radians = -radians }

    ctx.rotate(radians)
  }

  ctx.beginPath();

  if(options.sides == 'circle') {
    ctx.arc(0, 0, size, 0, 2 * Math.PI);
  } else {
    ctx.moveTo (size * Math.sin(0), size *  Math.cos(0));
    for (var i = 1; i <= sides;i += 1) {
      var x = Math.round(size * Math.sin(i * 2 * Math.PI / sides));
      var y = Math.round(size * Math.cos(i * 2 * Math.PI / sides));

      ctx.lineTo(x, y);
    }
  }

  if(options.outline) {
    // We are making the same polygon but 90% of the size to create an 'outline' from the delta.
    var innerPolygonSize = size * 0.9;

    if(options.sides == 'circle') {
      ctx.arc(0, 0, innerPolygonSize, 0, 2 * Math.PI);
    } else {
      ctx.moveTo(innerPolygonSize * Math.sin(0), innerPolygonSize * Math.cos(0));

      for (var i = 1; i <= sides;i += 1) {
        var x = Math.round(innerPolygonSize * Math.sin(i * 2 * Math.PI / sides));
        var y = Math.round(innerPolygonSize * Math.cos(i * 2 * Math.PI / sides));

        ctx.lineTo(x, y);
      }
    }
  }

  // NOTE: this is SUPER SUPER important for drawing outlines!!
  ctx.clip('evenodd');

  if(options.rotation) { ctx.rotate(-radians) }
  ctx.translate(-centerX, -centerY);

  if(options.thien) {
    ctx.drawImage(img, 0,0, img.width, img.height, 0, 0, size, size);
  }

  if(!options.orbiting) {
    ctx.drawImage(img, 0,0, img.width, img.height, 0, 0, canvas.width, canvas.height);
    ctx.restore();
  }
}

function drawOrbit(ctx, radius, numberOrbiting, direction, img, time, polygonOptions, orbitOffset = 0) {
  var radians = ((2 * Math.PI) / 48) * time.getSeconds() + ((2 * Math.PI) / 48000) * time.getMilliseconds();

  if(direction == 'counter-clockwise') { radians = -radians }

  for (var i = 1; i <= numberOrbiting; i++) {
    var offset = Math.PI * 2 * i / numberOrbiting;
    //var radians = Math.PI;

    ctx.save();
    ctx.translate(canvas.width/2 - 50, canvas.height/2 - 50);
    ctx.rotate(radians + offset + orbitOffset);
    ctx.translate(radius, 0);
    drawPolygon(ctx, radius/2, radius/2, img, time, polygonOptions);
    ctx.translate(-radius, 0);
    ctx.restore();
    ctx.rotate(-radians - offset - orbitOffset);
    ctx.drawImage(img, 0,0, img.width, img.height, 0, 0, polygonOptions.size, polygonOptions.size);
    ctx.translate(-canvas.width/2, -canvas.height/2)
    ctx.restore();
  };
}

function drawCircle(ctx, img) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 250, 0, 2 * Math.PI);
    ctx.lineWidth = 10;
    ctx.clip();
    ctx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      0,
      0,
      canvas.width,
      canvas.height
    );
    ctx.restore();
}

function drawBackgroundImage(ctx, img) {
    ctx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      0,
      0,
      canvas.width,
      canvas.height
    );
}

function drawElements(){

  var ctx = document.getElementById("canvas").getContext("2d")
  var time = new Date();
  var cx = canvas.width/2;
  var cy = canvas.height/2;

  ctx.globalCompositeOperation = "destination-over";
  ctx.clearRect(0,0,canvas.width, canvas.height);

  ctx.save();
  ctx.drawImage(
    t_italia,
    canvas.width*0.85,
    canvas.height*0.7,
    canvas.width*0.15,
    canvas.height*0.3,
  );
  ctx.restore();

  ctx.save();
  ctx.drawImage(
    t_shade,
    canvas.width/2 - 13,
    canvas.height/2+155,
    25,
    25
  );
  ctx.restore();

  drawCircle(ctx, treeImg, time);

  drawOrbit(ctx, 350, 8, 'clockwise', t_sad, time, { size: 100, sides: 'circle', orbiting: true });
  drawOrbit(ctx, 500, 3, 'counter-clockwise', t_luna, time, { size: 100, sides: 'circle', orbiting: true });
  drawOrbit(ctx, 500, 3, 'counter-clockwise', thienking, time, { size: 100, sides: 'circle', orbiting: true, thien: true, rotation: { offset: 0, animated: true } }, Math.PI/6);
  drawOrbit(ctx, 500, 3, 'counter-clockwise', t_shade, time, { size: 100, sides: 'circle', orbiting: true, thien: true, rotation: { offset: 0, animated: true } }, Math.PI/3);
  drawOrbit(ctx, 500, 3, 'counter-clockwise', t_meatball, time, { size: 100, sides: 'circle', orbiting: true, thien: true, rotation: { offset: 0, animated: true } }, Math.PI/2);

  //drawPolygon(ctx, cx, cy, riverImg, time, { sides: 3, rotation: { offset: 0 } });
  //drawPolygon(ctx, cx, cy, riverImg, time, { sides: 3, rotation: { offset: Math.PI } });
  //
  //drawPolygon(ctx, cx, cy, riverImg, time, { sides: 3, rotation: { offset: 0, animated: true } });
  //drawPolygon(ctx, cx, cy, riverImg, time, { sides: 3, rotation: { offset: 0, animated: true, direction: 'counter-clockwise' } });
  //drawPolygon(ctx, cx, cy, riverImg, time, { sides: 3, rotation: { offset: Math.PI, animated: true } });
  //
  //drawPolygon(ctx, cx, cy, riverImg, time, { sides: 4, rotation: { offset: 0 } });
  //drawPolygon(ctx, cx, cy, riverImg, time, { sides: 5, rotation: { offset: 0 } });
  //
  //drawPolygon(ctx, cx, cy, riverImg, time, { sides: 3, outline: true, rotation: { offset: 0 } });
  //
  //drawPolygon(ctx, cx, cy, riverImg, time, { sides: 3, outline: true, rotation: { offset: 0, animated: true } });
  //drawPolygon(ctx, cx, cy, riverImg, time, { sides: 3, outline: true, rotation: { offset: 0, animated: true, direction: 'counter-clockwise' } });
  //
  //drawPolygon(ctx, cx, cy, riverImg, time, { sides: 4, outline: true, rotation: { offset: 0 } });
  //drawPolygon(ctx, cx, cy, riverImg, time, { sides: 4, outline: true, rotation: { offset: 0, animated: true } });
  //drawPolygon(ctx, cx, cy, riverImg, time, { sides: 4, outline: true, rotation: { offset: 0, animated: true, direction: 'counter-clockwise' } });
  //
  //drawPolygon(ctx, cx, cy, riverImg, time, { size: 200, sides: 'circle', rotation: { offset: 0 } });
  //drawPolygon(ctx, cx, cy, riverImg, time, { size: 200, sides: 'circle', outline: true, rotation: { offset: 0 } });

  //drawOrbit(ctx, 300, 12, 'clockwise', riverImg, time, { sides: 'circle', size: 100, orbiting: true, rotation:{ offset: 0 } });
  //drawOrbit(ctx, 300, 12, 'clockwise', riverImg, time, { sides: 'circle', size: 100, outline: true, orbiting: true, rotation:{ offset: 0 } });
  //drawOrbit(ctx, 300, 12, 'counter-clockwise', riverImg, time, { sides: 'circle', size: 100, outline: true, orbiting: true, rotation:{ offset: 0 } });
  //
  //drawOrbit(ctx, 300, 12, 'clockwise', riverImg, time, { sides: 4, size: 100, outline: true, orbiting: true, rotation:{ offset: 0 } });
  //drawOrbit(ctx, 300, 12, 'clockwise', riverImg, time, { sides: 4, size: 100, outline: true, orbiting: true, rotation:{ offset: 0, animated: true } });
  //drawOrbit(ctx, 300, 12, 'clockwise', riverImg, time, { sides: 4, size: 100, outline: true, orbiting: true, rotation: { offset: Math.PI/4, animated: true }});

  //drawOrbit(ctx, 300, 12, 'clockwise', riverImg, time, { sides: 4, size: 100, outline: true, orbiting: true, rotation:{ offset: 0, animated: true } });
  //drawOrbit(ctx, 300, 12, 'clockwise', riverImg, time, { sides: 4, size: 100, outline: true, orbiting: true, rotation: { offset: 0, direction: 'counter-clockwise', animated: true }});

  //drawPolygon(ctx, cx, cy, riverImg, time, { sides: 5, outline: true, rotation: { offset: 0 } });
  drawBackgroundImage(ctx, backgroundImg, time);

  window.requestAnimationFrame(drawElements);
}

onDocumentRready(function() {
  console.log("DOM Ready!");
  var body = document.getElementsByTagName("body")[0];
  canvas = document.getElementById("canvas");

  canvas.width = body.offsetWidth;
  canvas.height = body.offsetHeight;

  backgroundImg.src = 'https://pbs.twimg.com/media/EB6q75_WwAIJz3A.jpg';
  treeImg.src = 'https://steemitimages.com/DQmaZrKCAZuoMtuW9vYDuYWJ8iHxKuvQXLRVJGb4f2F7Lr1/IiRlys6.jpg';
  //treeImg.src = 'thienking.png';
  riverImg.src = 'https://i.pinimg.com/originals/e6/6f/66/e66f66f33eebaa83b801493559fd30e6.jpg';
  t_italia.src = 'titalia.png';
  t_sad.src = 'tsad.png';
  t_luna.src = 'tluna.png';
  t_shade.src = 'tshade.png';
  t_meatball.src = 'tmeatball.png';
  thienking.src = 'thienking.png';

  window.requestAnimationFrame(drawElements);
});

function onDocumentRready(f) {
  /in/.test(document.readyState) ? setTimeout("onDocumentRready(" + f + ")", 9) : f();
}

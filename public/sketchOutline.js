const landscapes = ["forrest.jpeg", "desert.jpeg", "gradient.jpeg", "yosemite.jpeg", "snow.jpeg", "peak.jpeg"]

var canvas = "";
const backgroundImg = new Image();
const treeImg = new Image();
const riverImg = new Image();

var movingBalls = [];

function initalizeMovingBall(id, size, velocity) {
  var ball = {
    id: id,
    x: canvas.width/2,
    y: canvas.height/2,
    dx: velocity.x,
    dy: velocity.y,
    size: size
  };

  movingBalls.push(ball);
}

function collideWall(ball) {
  if ((ball.x + ball.dx > (canvas.width - ball.size)) || (ball.x + ball.dx < ball.size)) {
    ball.dx = -ball.dx;
  }

  if ((ball.y + ball.dy > (canvas.height - ball.size)) || (ball.y + ball.dy < ball.size)) {
    ball.dy = -ball.dy;
  }

  ball.x = ball.x + ball.dx;
  ball.y = ball.y + ball.dy;
};

function collideBall(ball) {
  movingBalls.forEach( function(movingBall) {
    if (ball.id == movingBall.id) { continue  }

    var delta_x = movingBall.x - ball.x;
    var delta_y = movingBall.y - ball.y;
    var distance = Math.sqrt(delta_x * delta_x + delta_y * delta_y);
    var collisionDistance = ball.size + movingBall.size;

    if (distance < collisionDistance) {
      var angle = Math.atan2(delta_x, delta_y);
      var new_x = ball.x + Math.cos(angle) * collisionDistance;
      var new_y = ball.y + Math.sin(angle) * collisionDistance;

      var acceleration_x = (new_x - ball.x);
      var acceleration_y = (new_y - ball.y);

      ball.dx = ball.dx - acceleration_x;
      ball.dy = ball.dy - acceleration_y;

      movingBall.dx = movingBall.dx - acceleration_x;
      movingBall.dy = movingBall.dy - acceleration_y;
    }
  });
}

function drawMovingBall(ball, ctx, time) {
  ctx.save();
  ctx.translate(ball.x, ball.y);
  drawPolygon(ctx, 0, 0, riverImg, time, { size: ball.size, sides: 'circle', orbiting: true });
  ctx.translate(-ball.x, -ball.y);
  ctx.drawImage(riverImg, 0,0, riverImg.width, riverImg.height, 0, 0, canvas.width, canvas.height);
  ctx.restore();
  ctx.restore();

  collideWall(ball);
  collideBall(ball);
  //console.log(" ball x restriction: " + (canvas.width - ball.size) + " ball y restriction: " + (canvas.height - ball.size));
  //console.log("ball x: " + ball.x + " ball dx: " + ball.dx + " ball y: " + ball.y + " ball dy: " + ball.dy);
}

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
    if(options.rotation.direction == 'counter-clockwise') { radians = -radians }
    if(options.rotation.offset) { radians += options.rotation.offset }

    ctx.rotate(radians)
  }

  ctx.beginPath();
  //ctx.moveTo (size * Math.cos(0), size *  Math.sin(0));
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

    //ctx.moveTo(innerPolygonSize * Math.cos(0), innerPolygonSize * Math.sin(0));

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

  if(!options.orbiting) {
    ctx.drawImage(img, 0,0, img.width, img.height, 0, 0, canvas.width, canvas.height);
    ctx.restore();
  }
}

function drawOrbit(ctx, radius, numberOrbiting, direction, img, time, polygonOptions) {
  var radians = ((2 * Math.PI) / 48) * time.getSeconds() + ((2 * Math.PI) / 48000) * time.getMilliseconds();

  if(direction == 'counter-clockwise') { radians = -radians }

  for (var i = 1; i <= numberOrbiting; i++) {
    var offset = Math.PI * 2 * i / numberOrbiting;
    //var radians = Math.PI;

    ctx.save();
    ctx.translate(canvas.width/2, canvas.height/2);
    ctx.rotate(radians + offset);
    ctx.translate(radius, 0);
    drawPolygon(ctx, radius/2, radius/2, img, time, polygonOptions);
    ctx.translate(-radius, 0);
    ctx.rotate(-radians - offset);
    ctx.translate(-canvas.width/2, -canvas.height/2)
    ctx.drawImage(img, 0,0, img.width, img.height, 0, 0, canvas.width, canvas.height);
    ctx.restore();
    ctx.restore();
  };
}

function drawCircle(ctx, img) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(188, 150);
    ctx.arc(canvas.width / 2, canvas.height / 2, 300, 0, 2 * Math.PI);
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


  movingBalls.forEach( function(ball) {
    drawMovingBall(ball, ctx, time);
  });
  //drawCircle(ctx, treeImg, time);
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
  riverImg.src = 'https://i.pinimg.com/originals/e6/6f/66/e66f66f33eebaa83b801493559fd30e6.jpg';


  initalizeMovingBall(1, 100, { x: 4, y: 2 });
  initalizeMovingBall(2, 100, { x: 2, y: 2 });

  window.requestAnimationFrame(drawElements);
});

function onDocumentRready(f) {
  /in/.test(document.readyState) ? setTimeout("onDocumentRready(" + f + ")", 9) : f();
}

var canvas = document.createElement('canvas');
canvas.width = '100px';
canvas.height = '100px';
document.body.appendChild(canvas);

var Circle = function() { this.initialize.apply(this, arguments) };
Circle.canvas = canvas; // ...
Circle.prototype = {
    initialize: function(radian, alpha) {
        this.graphics = Circle.canvas.getContext('2d');
        this.radian = radian;
        this._alpha = alpha;
    },
    draw: function(radian, alpha) {
        var graphics = this.graphics;
        graphics.save();
        graphics.translate(50,50);
        graphics.fillStyle = "rgba(0,0,0," + alpha + ")";
        graphics.rotate(radian);
        graphics.beginPath();
        graphics.arc(30, 0, 5,0, Math.PI * 2, true);
        graphics.fill();
        graphics.restore();
    },
    set alpha(val) {
        this._alpha = val;
        this.draw(this.radian, val);
    },
    get alpha(val) {
        return this._alpha;
    }
};

JSTweener._eventLoop = JSTweener.eventLoop;
JSTweener.eventLoop = function() {
    Circle.canvas.getContext('2d').clearRect(0,0,100,100);
    JSTweener._eventLoop();
}

var animationCircle = function() {
    var circles = 12;
    for (var i = 0; i < circles; i++) {
        var c = new Circle(Math.PI*2/circles*i, 1);
        var options = {
            alpha: 0,
            delay: (i || 0.001) / 10,
            time: 1
        };
        if (i == circles-1) options.onStart = animationCircle;
        JSTweener.addTween(c, options);
     }
}
animationCircle();

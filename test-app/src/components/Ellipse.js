import Figure from "./Figure";

class Ellipse extends Figure {
    constructor(id, background, borderRadius, x, y){
        /* x, y = center of the ellipse */
        super(id, background, borderRadius, x, y);
        this.radius = 37.5;
    }

    draw(ctx, isSelected) {
        ctx.save();
        ctx.scale(2, 1);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, );
        ctx.restore();
        ctx.fillStyle = this.background;
        ctx.fill();
        if(isSelected){
            ctx.lineWidth = this.borderRadius;
            ctx.strokeStyle = 'black';
            ctx.stroke();
        }
    }
}

export default Ellipse


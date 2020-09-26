import Figure from "./Figure";

class Ellipse extends Figure {
    constructor(id, background, borderRadius, x, y){
        super(id, background, borderRadius, x, y);
        this.rx = 75;
        this.ry = 37.5;
    }

    draw(ctx, isSelected) {
        ctx.save();
        ctx.scale(2, 1);
        ctx.beginPath();
        ctx.arc((this.x + this.rx) / 2, this.y + this.ry, this.ry, 0, 2 * Math.PI, );
        ctx.restore();
        ctx.fillStyle = this.background;
        ctx.fill();
        if(isSelected){
            ctx.lineWidth = this.borderRadius;
            ctx.strokeStyle = 'black';
            ctx.stroke();
        }
    }
    isMouseWithinFigure(mouseX, mouseY){
        return (mouseX - this.x - this.rx) ** 2 / this.rx ** 2 + (mouseY - this.y - this.ry) ** 2 / this.ry ** 2 <= 1
    }
}

export default Ellipse


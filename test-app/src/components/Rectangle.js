import Figure from "./Figure";

class Rectangle extends Figure {
    draw(ctx, isSelected) {
        ctx.fillStyle = this.background;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        if (isSelected){
            ctx.lineWidth = this.border;
            ctx.strokeStyle = 'black';
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }
    isMouseWithinFigure(mouseX, mouseY){
        return mouseX >= this.x && mouseY >= this.y && mouseX <= this.x + this.width && mouseY <= this.y + this.height
    }
}

export default Rectangle
class Figure {
    constructor(id, background, borderRadius, x, y, offsetX, offsetY){
        this.id = id;
        this.background = background;
        this.borderRadius = borderRadius;
        this.width = 150;
        this.height = 75;
        this.x = x;
        this.y = y;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
    }
    draw(ctx, isSelected){
        console.log('Drawing...')
    }
    isMouseWithinFigure(mouseX, mouseY){
        return true;
    }
}

export default Figure
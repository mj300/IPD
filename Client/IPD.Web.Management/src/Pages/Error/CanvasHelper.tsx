
export class Circle {
   public x: number;
   public y: number;
   public dx: number;
   public dy: number;
   public radius: number;
   public radiusOrg: number;
   public randomNum: number = Math.random();
   public fillColor: string = "";

   constructor(x: number,
      y: number,
      dx: number,
      dy: number,
      radius: number,
      color?: string) {
      this.x = x;
      this.y = y;
      this.dx = dx;
      this.dy = dy;
      this.radius = radius;
      this.radiusOrg = radius;
      this.fillColor = color! || "";
   }

   public drawSpace(c?: CanvasRenderingContext2D | null) {
      if (this.x + this.radius >= c!.canvas.width || this.x - this.radius < 0)
         this.dx = -this.dx;
      if (this.y + this.radius >= c!.canvas.height || this.y - this.radius < 0)
         this.dy = -this.dy;
      if (!!this.fillColor) {
         c!.fillStyle = this.fillColor;
         c!.strokeStyle = "rgba(0,0,0,0)";

      }
      c?.fill();
      if (this.radius === this.radiusOrg) {
         c?.fillText("404", this.x, this.y);
      }
      else {
         c?.fillText("Page Not Found", this.x, this.y);
      }
      c!.font = `${this.radius}px  Arial`;
      //if (this.radius === this.radiusOrg) {
      //   c?.beginPath();
      //   c?.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      //}
      //else {
      //   c!.font = `${this.radius}px  Arial`;
      //}
      this.x += this.dx;
      this.y += this.dy;
      c?.stroke();
   }
   public drawGravity(c?: CanvasRenderingContext2D | null) {
      //if (this.x + this.radius >= c!.canvas.width || this.x - this.radius < 0)
      //   this.dx = -this.dx;
      if (this.y + this.radius >= c!.canvas.height || this.y - this.radius < 0)
         this.dy = -this.dy;
      else {
         this.dy += 1;
      }
      this.y += this.dy;
      if (!!this.fillColor)
         c!.fillStyle = this.fillColor;
      c?.fill();
      //if (this.radius === this.radiusOrg) {
      //   c?.beginPath();
      //   c?.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      //}
      //else {
      //   c!.font = `${this.radius}px  Arial`;
      //   c?.fillText("404", this.x, this.y);
      //}
      //this.x += this.dx;
      c?.stroke();
   }
}
export class MousePos {
   public x?: number;
   public y?: number;

   constructor();
   constructor(x?: number, y?: number);
   constructor(x?: number, y?: number) {
      this.x = x;
      this.y = y;
   }
}
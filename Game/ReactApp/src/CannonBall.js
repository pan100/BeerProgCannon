class CannonBall {
    constructor(angle, speed) {
        this.angle = angle-90;
        this.speed = speed;
        this.x = 0;
        this.y = 0;
        this.velocity_x = this.speed * Math.cos((2 * Math.PI / 360) * this.angle);
        this.velocity_y = this.speed * Math.sin((2 * Math.PI / 360) * this.angle);
    }
    moveForward() {
        this.x += this.velocity_x * (5/1000);
        this.y += this.velocity_y * (5/1000);
  }
}
export default CannonBall;
class Person {
    constructor(gender, speed) {
        this.gender = gender;
        this.x = 0;
        this.y = 0;
        this.speed = speed;
    }
    moveForward() {
        this.x = this.x +this.speed;
    }

}
export default Person;
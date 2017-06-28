class Person {
    constructor(gender, direction) {
        this.gender = gender;
        this.direction = direction;
        this.x = 0;
        if(direction=="LEFT") {
            this.x = 800;
        }
        this.y = 0;
    }
    moveForward() {
        if(this.direction == "RIGHT") {
            this.x++;
        }
        else {
            this.x--;
        }
    }

}
export default Person;
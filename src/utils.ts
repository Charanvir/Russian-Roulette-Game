import chalk from "chalk";

interface PlayerDef {
  name: string;
  bullet: number;
  chamber: number[];
  alive: boolean;
  getChamberLength(): number;
  fireGun(): void;
  gotShot(): void;
  isAlive(): boolean;
}

export class Player implements PlayerDef {
  name: string;
  bullet: number;
  chamber: number[] = [1, 2, 3, 4, 5, 6];
  alive = true;

  constructor(name: string) {
    this.name = name;
    this.bullet = Math.floor(Math.random() * 6) + 1;
  }

  getChamberLength(): number {
    return this.chamber.length;
  }

  fireGun(): void {
    let chamberPosition = Math.floor(Math.random() * this.chamber.length);
    if (this.chamber[chamberPosition] === this.bullet) {
      this.alive = false;
      this.gotShot();
      return;
    }
    this.chamber = this.chamber.filter(
      (num) => num !== this.chamber[chamberPosition]
    );
    console.log(chalk.bold.cyan.underline("You have Survived......for now"));
    return;
  }

  gotShot(): void {
    console.log(chalk.red.bold("YOU HAVE BEEN SHOT"));
  }

  isAlive(): boolean {
    return this.alive;
  }
}

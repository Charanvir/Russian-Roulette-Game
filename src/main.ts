import { Player } from "./utils.js";
import inquirer from "inquirer";
import chalk from "chalk";
import boxen from "boxen";

const Game: Player[] = [];

const startGameQuestions = [
  {
    type: "number",
    name: "players",
    message: "How many players will be playing today?",
  },
];

function initiateGame() {
  const welcomeMsg = chalk.green.bold("Welcome to Liar's Card");
  console.log(
    boxen(welcomeMsg, {
      padding: 1,
      margin: 1,
      borderStyle: "singleDouble",
      borderColor: "green",
    })
  );

  // @ts-ignore
  inquirer.prompt(startGameQuestions).then((answer) => {
    console.log(`Number of players: ${answer.players}`);

    const playerCount = answer.players;

    const askForPlayerName = (i: number) => {
      if (i < playerCount) {
        const playerNameQuestion = [
          {
            type: "input",
            name: "playerName",
            message: `What is Player ${i + 1} name?`,
          },
        ];

        // @ts-ignore
        inquirer.prompt(playerNameQuestion).then((playerName) => {
          const player = new Player(playerName.playerName);
          Game.push(player);
          askForPlayerName(i + 1);
        });
      } else {
        playGame(Game);
      }
    };

    askForPlayerName(0);
  });
}

const playGame = async function (game: any) {
  if (game.length === 1) {
    console.log(`${game[0].name} is the last surviving player.`);
    const winnerMsg = chalk.bold.underline.cyan(
      `🎉🎉 ${game[0].name} is the winner! 🎉🎉`
    );
    console.log(
      boxen(winnerMsg, {
        padding: 2,
        margin: 2,
        borderStyle: "double",
        borderColor: "yellow",
        backgroundColor: "green",
        align: "center",
      })
    );
    process.exit(0);
  }

  console.log("************************************");
  const currentPlayerMsg = chalk.blue.bold.underline(
    `It is ${game[0].name}'s turn`
  );
  console.log(
    boxen(currentPlayerMsg, {
      padding: 1,
      margin: 1,
      borderStyle: "singleDouble",
      borderColor: "yellow",
    })
  );

  const { prompt } = await inquirer.prompt([
    {
      type: "list",
      name: "prompt",
      message: chalk.bold.green("What would you like to do?"),
      choices: [
        "Fire Gun",
        "Chamber Status",
        "Check Remaining Players",
        "Exit",
      ],
    },
  ]);

  if (prompt === "Chamber Status") {
    console.log(
      chalk.bold.cyan(
        `---- ${
          game[0].name
        } has ${game[0].getChamberLength()} chamber slots left ----`
      )
    );
    return playGame(game);
  }

  if (prompt === "Check Remaining Players") {
    console.log(chalk.bold("The following players are remaining in the game"));
    game.forEach((player: Player) => {
      console.log(
        ` --- ${chalk.bold.green(
          player.name
        )} --- ${player.getChamberLength()}/6`
      );
    });

    return playGame(game);
  }

  if (prompt === "Fire Gun") {
    game[0].fireGun();

    if (!game[0].isAlive()) {
      const deadMsg = chalk.black.bold.underline(`${game[0].name} has died.`);
      console.log(
        boxen(deadMsg, {
          padding: 1,
          margin: 1,
          borderStyle: "singleDouble",
          borderColor: "red",
          backgroundColor: "white",
        })
      );
      game.shift();
    } else {
      const currentPlayer = game.shift();
      game.push(currentPlayer);
    }

    return playGame(game);
  }

  if (prompt === "Exit") {
    console.log(`${game[0].name} has exited the game.`);
    process.exit(0);
  }
};

initiateGame();

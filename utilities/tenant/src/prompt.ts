import { createInterface, Interface } from "readline";

export class Prompt {
  public async ask(text: string): Promise<string> {
    let haveAnswer = false;
    let answer: string = "";

    while (!haveAnswer) {
      answer = await this.performAsk(text);

      const trimmedAnswer = answer.trim();
      if (trimmedAnswer === "") {
        console.log(`invalid input, please try again.`);
      } else {
        haveAnswer = true;
      }
    }

    return answer;
  }

  private async performAsk(text: string) {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise<string>((resolve) => {
      rl.question(`${text}\n`, (value) => {
        rl.close();
        resolve(value);
      });
    });
  }
}
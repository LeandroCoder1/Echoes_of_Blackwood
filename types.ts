
export interface GameScene {
  description: string;
  choices: string[];
}

export interface GameState extends GameScene {
  imageUrl: string;
}

# HTML_Animations
HTML Canvas Animations

Implementation of easy canvas animation/game

## Conway's Game of Life
  Here's the [wiki](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life).
  
  Initialisation : A cell is randomly alive (CHANCE = 5%).
  
  Rules : 
    - A alive cell at time `n` remains alive at `n+1` if only 2 or 3 nearby cells are alive at `n`.
    - A dead cell at time `n` revive at `n+1` if it have precisely 3 nearby alive cells at `n`.
    - A alive cell at time `n` dies at `n+1` if it have less than 2 or more than 3 nearby alive cells at `n`.
    
## Langton's ant  
  Here's the [wiki](https://en.wikipedia.org/wiki/Langton%27s_ant).
  
  Initialisation : all cells are white, the ant is at the middle.
  
  Rules: 
    - If the ant is at a white cell, she'll be turning 90 degres left.
    - If the ant is at a black cell, she'll be turning 90 degres right.
    
  Anyway on leaving, the ant turn the cell's color.
  
## Snake
  Here's the [wiki](https://en.wikipedia.org/wiki/Snake_(video_game_genre)).

The Snake game. Use arrow for moving, space for pause. 
  
  You lose if you touch the border, or if you step on your tail.

## Space Invaders

Funny game. Drawing aliens and spaceship.
Shooting and killing aliens ( no racism )

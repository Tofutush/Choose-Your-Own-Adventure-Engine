# Don't READ ME.

## Outcome has two types game and dead

- game means the Option leads to more game content
- dead is a dead end it can mean a fail or a win

## every time an Option leads to an Outcome type game it sets nowGame to the Outcome and preGame to the previous game (for returning)

### but there might be some probs... (stated below: deep / shallow copy)

# ive a huge problem dude. the game keeps loading and its never gonna stop. we cant let the outcome initialize until its needed. or itll never stop like a dead loop! (this problem is maybe solved)

# ive another problem. the deep / shallow copy problem. b/c of shallow copy, preGame and nowGame points to the same thing. no we want to shallow copy that (maybe solved again!!)

# until now the project is pretty well! might want some more features:
- able to not use <text> tags when theres only one line text
- add a goback option after every single scene
